/** Booking form: inline validation, async submit, success + error states. */
import { gsap } from '../core/gsap';
import { $, $$, wait } from '../core/dom';
import { ScrollTrigger } from '../core/gsap';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{7,20}$/;

type Field = HTMLInputElement | HTMLTextAreaElement;

function validate(input: Field) {
  const v = input.value.trim();
  let ok = true;
  if (input.required && !v) ok = false;
  else if (v && input.type === 'email') ok = EMAIL.test(v);
  else if (v && input.type === 'tel') ok = PHONE.test(v) && v.replace(/\D/g, '').length >= 7;
  const wrap = input.closest<HTMLElement>('[data-field]')!;
  const err = wrap.querySelector<HTMLElement>('.field__error')!;
  wrap.classList.toggle('is-invalid', !ok);
  input.setAttribute('aria-invalid', String(!ok));
  err.textContent = ok ? '' : input.dataset.error ?? 'Required';
  return ok;
}

export function initForms(scope: ParentNode = document) {
  $$<HTMLFormElement>('[data-form]', scope).forEach((form) => {
    const body = $('[data-form-body]', form)!;
    const success = $('[data-form-success]', form)!;
    const error = $('[data-form-error]', form)!;
    const live = $('[data-form-live]', form)!;
    const inputs = $$<Field>('.field__input', form);
    const touched = new WeakSet<Field>();

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() || touched.has(input)) {
          touched.add(input);
          validate(input);
        }
      });
      input.addEventListener('input', () => {
        if (touched.has(input)) validate(input);
      });
    });

    const swap = async (from: HTMLElement, to: HTMLElement) => {
      await gsap.to(from, { autoAlpha: 0, y: -16, duration: 0.45, ease: 'power2.in' });
      from.hidden = true;
      gsap.set(from, { clearProps: 'all' });
      to.hidden = false;
      gsap.fromTo(to, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1 });
      to.focus({ preventScroll: true });
      ScrollTrigger.refresh();
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      inputs.forEach((i) => touched.add(i));
      const results = inputs.map(validate);
      if (results.includes(false)) {
        const first = inputs[results.indexOf(false)];
        first.focus();
        live.textContent = 'Please correct the highlighted fields.';
        return;
      }

      form.classList.add('is-sending');
      form.setAttribute('aria-busy', 'true');
      live.textContent = 'Sending your request…';

      let ok = true;
      const data = new FormData(form);
      const endpoint = form.dataset.endpoint;
      try {
        if (data.get('company_website')) {
          await wait(800); // honeypot: silently "succeed"
        } else if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          ok = res.ok;
        } else {
          await wait(1200); // no endpoint configured yet — simulate
          ok = new URLSearchParams(location.search).get('form') !== 'error';
        }
      } catch {
        ok = false;
      }

      form.classList.remove('is-sending');
      form.removeAttribute('aria-busy');
      live.textContent = ok ? 'Request sent.' : 'Your request could not be sent.';
      await swap(body, ok ? success : error);
      if (ok) {
        form.reset();
        inputs.forEach((i) => i.closest('[data-field]')?.classList.remove('is-invalid'));
      }
    });

    $('[data-form-reset]', form)?.addEventListener('click', () => swap(success, body));
    $('[data-form-retry]', form)?.addEventListener('click', () => swap(error, body));
  });
}
