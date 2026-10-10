/**
 * Firebase — booking requests are stored in Firestore and the admin page signs in
 * with Google. Both work on the free Spark plan (no Blaze, no Cloud Storage, no
 * Cloud Functions).
 *
 * The values below identify the project; they are not secrets and are meant to ship
 * in the page. Access is decided by the Firestore security rules (firestore.rules),
 * never by this file. Set them in `.env` — see `.env.example`.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';

const config = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID as string | undefined,
};

/** False until the four values are set — the site then behaves as it did before. */
export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

let app: FirebaseApp | null = null;
export function firebaseApp() {
  if (!firebaseReady) throw new Error('Firebase is not configured');
  return (app ??= initializeApp(config));
}

export const BOOKINGS = 'bookings';
export const ADMINS = 'admin'; // matches the collection name in the Firebase console
export const STATUSES = ['new', 'contacted', 'done'] as const;
export type Status = (typeof STATUSES)[number];
