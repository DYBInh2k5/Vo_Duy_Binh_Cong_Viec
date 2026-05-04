import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const remoteConfig = getRemoteConfig(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// App Check (Security)
if (typeof window !== 'undefined') {
  // Replace with your actual reCAPTCHA site key in production
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6Lc7o_8qAAAAAMkY7e-m_kUXm2C9z-T3p-_qE_f-'), 
    isTokenAutoRefreshEnabled: true
  });
}

// Remote Config Setup
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
  "show_maintenance_mode": false,
  "theme_accent_color": "#FFC107",
  "welcome_message": "Welcome to Bauhaus Lab"
};

export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Validation check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
