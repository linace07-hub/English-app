import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

let app;
let auth: any;
let db: any;

try {
  // We use require for optional config if it doesn't exist yet
  const firebaseConfig = await import('../../firebase-applet-config.json', { assert: { type: 'json' } });
  app = initializeApp(firebaseConfig.default);
  auth = getAuth(app);
  db = getFirestore(app);

  // Validate connection
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      console.warn("Firebase connection test failed - this is expected if rules are not deployed yet.");
    }
  };
  testConnection();
} catch (e) {
  console.warn("Firebase config not found. Please complete the Firebase setup in the UI.");
}

export { auth, db };

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
