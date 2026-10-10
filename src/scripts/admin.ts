/**
 * Admin — booking requests and the admin list.
 *
 * Sign-in is by Google, or by email and password. There is no way to register here:
 * password accounts are created by an owner in the Firebase console, and any account
 * is an admin only if an existing admin has added its email (see the "Admins" tab)
 * AND the address is verified. All of that is enforced by firestore.rules on the
 * server — this file just reflects it.
 *
 * Everything a visitor typed is written to the page with textContent, never as HTML.
 */
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { ADMINS, BOOKINGS, STATUSES, firebaseApp, firebaseReady, type Status } from './core/firebase';

type Booking = { id: string; name: string; email: string; phone: string; message?: string; context?: string; status: Status; createdAt?: Timestamp; updatedBy?: string };
type Admin = { email: string; addedBy?: string; addedAt?: Timestamp };

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const views = ['setup', 'loading', 'signin', 'verify', 'denied', 'app'] as const;
const show = (name: (typeof views)[number]) => views.forEach((v) => ($(`[data-view="${v}"]`).hidden = v !== name));

/** Small DOM builder: el('a', { href, class }, 'text' | node …) */
function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...children: (Node | string)[]) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  node.append(...children);
  return node;
}

const when = (t?: Timestamp) => (t ? t.toDate().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
const digits = (s: string) => s.replace(/\D/g, '');
/** "5 min ago", "Yesterday", "12 Oct" — the exact time stays on hover */
function ago(t?: Timestamp) {
  if (!t) return 'Just now';
  const d = t.toDate();
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} hr ago`;
  if (mins < 60 * 48) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(d.getFullYear() !== new Date().getFullYear() && { year: 'numeric' }) });
}
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function toast(message: string, bad = false) {
  const t = $('[data-toast]');
  t.textContent = message;
  t.classList.toggle('is-bad', bad);
  t.hidden = false;
  window.clearTimeout(Number(t.dataset.timer));
  t.dataset.timer = String(window.setTimeout(() => (t.hidden = true), bad ? 9000 : 4000));
}

if (!firebaseReady) {
  show('setup');
} else {
  const auth = getAuth(firebaseApp());
  const db = getFirestore(firebaseApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  let me = '';
  let stop: Unsubscribe[] = [];
  let bookings: Booking[] = [];
  let admins: Admin[] = [];
  let filter: Status | 'all' = 'all';
  let search = '';

  /* ---------------------------------------------------------------- auth */
  $('[data-signin]').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') toast('Sign-in failed. Please try again.', true);
    }
  });
  document.querySelectorAll('[data-signout]').forEach((b) => b.addEventListener('click', () => signOut(auth)));

  // email + password (accounts are created in the Firebase console, never here)
  const login = $<HTMLFormElement>('[data-login]');
  login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = String(new FormData(login).get('email') ?? '').trim();
    const password = String(new FormData(login).get('password') ?? '');
    if (!EMAIL.test(email) || !password) return toast('Enter your email and password.', true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      login.reset();
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      // one message for every wrong-credential case, so the page never reveals
      // which emails have accounts
      const message: Record<string, string> = {
        'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
        'auth/operation-not-allowed': 'Email sign-in is switched off in Firebase (Authentication → Sign-in method).',
        'auth/network-request-failed': 'No connection to Firebase. Check your internet or ad-blocker and try again.',
        'auth/user-disabled': 'This account has been disabled.',
      };
      toast(message[code] ?? 'Wrong email or password.', true);
    }
  });
  $('[data-forgot]').addEventListener('click', async () => {
    const email = String(new FormData(login).get('email') ?? '').trim();
    if (!EMAIL.test(email)) return toast('Type your email above first.', true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      /* same message either way */
    }
    toast('If that email has an account, a reset link is on its way.');
  });

  // confirming a password account's address
  $('[data-verify-send]').addEventListener('click', async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      toast('Confirmation email sent. Check your inbox and spam folder.');
    } catch {
      toast('Could not send the email. Wait a minute and try again.', true);
    }
  });
  $('[data-verify-done]').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    await user.reload();
    if (!user.emailVerified) return toast('Not confirmed yet — open the link in the email first.', true);
    await user.getIdToken(true); // the server reads "verified" from the token, so refresh it
    enter(user);
  });

  onAuthStateChanged(auth, (user: User | null) => enter(user));

  async function enter(user: User | null) {
    stop.forEach((u) => u());
    stop = [];
    bookings = [];
    admins = [];
    if (!user) return show('signin');

    show('loading');
    me = (user.email ?? '').toLowerCase();
    if (!user.emailVerified) {
      $('[data-verify-email]').textContent = me || 'this address';
      return show('verify');
    }
    let allowed = false;
    let why = 'This email is not in the admin list. In Firestore, the collection must be named "admins" and the document ID must be exactly this email, in lower case.';
    try {
      // the rules let a verified user read only their own entry — a missing entry or
      // a refusal both mean "not an admin"
      allowed = (await getDoc(doc(db, ADMINS, me))).exists();
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      why =
        code === 'permission-denied'
          ? 'Firestore refused the check. The published rules are probably an older version — paste the current firestore.rules into the Rules tab and publish.'
          : `Could not reach the database (${code || 'unknown error'}). Check your connection and try again.`;
    }
    if (!allowed) {
      $('[data-denied-email]').textContent = me || 'this account';
      $('[data-denied-why]').textContent = why;
      return show('denied');
    }

    $('[data-me]').textContent = me;
    show('app');
    stop.push(
      onSnapshot(
        query(collection(db, BOOKINGS), orderBy('createdAt', 'desc'), limit(500)),
        (snap) => {
          bookings = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, 'id'>) }));
          renderBookings();
        },
        () => toast('Could not load requests.', true),
      ),
      onSnapshot(
        collection(db, ADMINS),
        (snap) => {
          admins = snap.docs.map((d) => d.data() as Admin).sort((a, b) => a.email.localeCompare(b.email));
          renderAdmins();
        },
        () => toast('Could not load admins.', true),
      ),
    );
  }

  /* ---------------------------------------------------------------- tabs */
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((tab) =>
    tab.addEventListener('click', () => {
      document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    }),
  );

  /* ------------------------------------------------------------ requests */
  const list = $('[data-bookings]');

  function renderBookings() {
    const counts: Record<string, number> = { all: bookings.length, new: 0, contacted: 0, done: 0 };
    bookings.forEach((b) => (counts[b.status] = (counts[b.status] ?? 0) + 1));
    $('[data-summary]').textContent = !bookings.length ? 'Nothing here yet' : counts.new ? `${counts.new} waiting for a reply` : 'All caught up';
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((f) => {
      f.setAttribute('aria-pressed', String(f.dataset.filter === filter));
      f.querySelector('[data-count]')!.textContent = String(counts[f.dataset.filter!] ?? 0);
    });

    const q = search.trim().toLowerCase();
    const rows = bookings.filter((b) => (filter === 'all' || b.status === filter) && (!q || [b.name, b.email, b.phone, b.message ?? ''].some((v) => v.toLowerCase().includes(q))));

    list.replaceChildren(
      ...rows.map((b) => {
        // status: three steps side by side — the current one is filled in
        const status = el('div', { class: 'adm-seg', role: 'group', 'aria-label': `Status for ${b.name}` });
        STATUSES.forEach((st) => {
          const step = el('button', { type: 'button', class: `adm-seg__btn adm-seg__btn--${st}`, 'aria-pressed': String(st === b.status) }, el('i', { 'aria-hidden': 'true' }), st[0].toUpperCase() + st.slice(1));
          step.addEventListener('click', async () => {
            if (st === b.status) return;
            status.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === step)));
            try {
              await updateDoc(doc(db, BOOKINGS, b.id), { status: st, updatedAt: serverTimestamp(), updatedBy: me });
            } catch {
              renderBookings();
              toast('Could not update the status.', true);
            }
          });
          status.append(step);
        });

        const remove = el('button', { type: 'button', class: 'adm-del', 'aria-label': `Delete the request from ${b.name}` }, 'Delete');
        remove.addEventListener('click', async () => {
          if (!window.confirm(`Delete the request from ${b.name}? This cannot be undone.`)) return;
          try {
            await deleteDoc(doc(db, BOOKINGS, b.id));
          } catch {
            toast('Could not delete the request.', true);
          }
        });

        const wa = digits(b.phone);
        const initials = b.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
        const chip = (label: string, value: string, href: string, external = false) =>
          el('a', { class: 'adm-chip', href, ...(external ? { target: '_blank', rel: 'noopener' } : {}) }, el('span', { class: 'adm-chip__label' }, label), value);

        return el(
          'li',
          { class: `adm-card adm-card--${b.status}` },
          el('span', { class: 'adm-card__avatar', 'aria-hidden': 'true' }, initials),
          el(
            'div',
            { class: 'adm-card__main' },
            el(
              'div',
              { class: 'adm-card__head' },
              el('h3', { class: 'adm-card__name' }, b.name),
              el('time', { class: 'adm-card__time', title: when(b.createdAt) }, ago(b.createdAt)),
              el('span', { class: 'adm-card__meta' }, [b.context && `From: ${b.context}`, b.updatedBy && `Updated by ${b.updatedBy}`].filter(Boolean).join(' · ')),
            ),
            el(
              'div',
              { class: 'adm-card__chips' },
              chip('Call', b.phone, `tel:${b.phone.replace(/[^\d+]/g, '')}`),
              ...(wa.length >= 10 ? [chip('WhatsApp', 'Open chat', `https://wa.me/${wa.length === 10 ? '91' + wa : wa}`, true)] : []),
              chip('Email', b.email, `mailto:${b.email}`),
            ),
            ...(b.message ? [el('p', { class: 'adm-card__message' }, b.message)] : []),
            el('div', { class: 'adm-card__foot' }, status, remove),
          ),
        );
      }),
    );
    $('[data-empty]').hidden = rows.length > 0;
    $('[data-empty]').textContent = bookings.length ? 'No requests match this view.' : 'No requests yet. New ones appear here as soon as they are sent.';
  }

  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((f) =>
    f.addEventListener('click', () => {
      filter = f.dataset.filter as Status | 'all';
      renderBookings();
    }),
  );
  $<HTMLInputElement>('[data-search]').addEventListener('input', (e) => {
    search = (e.target as HTMLInputElement).value;
    renderBookings();
  });

  $('[data-export]').addEventListener('click', () => {
    // a leading apostrophe stops spreadsheet apps treating a cell as a formula
    const cell = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    const rows = [['Received', 'Name', 'Phone', 'Email', 'Message', 'From', 'Status'], ...bookings.map((b) => [when(b.createdAt), b.name, b.phone, b.email, b.message ?? '', b.context ?? '', b.status])];
    const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `raaha-requests-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* -------------------------------------------------------------- admins */
  function renderAdmins() {
    $('[data-admins]').replaceChildren(
      ...admins.map((a) => {
        const row = el('li', { class: 'adm-admin' }, el('div', {}, el('strong', {}, a.email), el('span', { class: 'adm-admin__meta' }, a.email === me ? 'You' : a.addedBy ? `Added by ${a.addedBy} · ${when(a.addedAt)}` : 'Added in the console')));
        if (a.email !== me) {
          const remove = el('button', { type: 'button', class: 'adm-link adm-link--danger' }, 'Remove');
          remove.addEventListener('click', async () => {
            if (!window.confirm(`Remove ${a.email} as an admin? They will lose access immediately.`)) return;
            try {
              await deleteDoc(doc(db, ADMINS, a.email));
              toast(`${a.email} removed.`);
            } catch {
              toast('Could not remove this admin.', true);
            }
          });
          row.append(remove);
        }
        return row;
      }),
    );
  }

  $<HTMLFormElement>('[data-add-admin]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $<HTMLInputElement>('[data-add-admin] input');
    const email = input.value.trim().toLowerCase();
    if (!EMAIL.test(email)) return toast('Enter a valid email address.', true);
    if (admins.some((a) => a.email === email)) return toast('That account is already an admin.', true);
    try {
      await setDoc(doc(db, ADMINS, email), { email, addedBy: me, addedAt: serverTimestamp() });
      input.value = '';
      toast(`${email} can now sign in.`);
    } catch {
      toast('Could not add this admin.', true);
    }
  });
}
