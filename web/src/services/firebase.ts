import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAnmOHLCNzePEfmYpISR-dAMqZCwKFEcsM',
  authDomain: 'proyecto-login-358515.firebaseapp.com',
  projectId: 'proyecto-login-358515',
  storageBucket: 'proyecto-login-358515.firebasestorage.app',
  messagingSenderId: '398262633488',
  appId: '1:398262633488:web:05b4688a97ee6f9fb6b695',
  measurementId: 'G-PTXCHMW852',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const isFirebaseConfigured = true;

export const analyticsPromise =
  typeof window !== 'undefined'
    ? isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    : Promise.resolve(null);
