// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Validate that Firebase config is set
const REQUIRED_ENV_VARS = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const missingVars = REQUIRED_ENV_VARS.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0 && import.meta.env.MODE === 'production') {
    console.error('Missing Firebase configuration:', missingVars);
    throw new Error(`Firebase configuration error: Missing ${missingVars.join(', ')}. Please check your .env file.`);
}

if (missingVars.length > 0) {
    console.warn('⚠️  Firebase configuration incomplete. Using placeholder values for development.');
    console.warn('Missing variables:', missingVars);
    console.warn('Please configure your .env file with real Firebase credentials for full functionality.');
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "velcy-fashion.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "velcy-fashion",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "velcy-fashion.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:dummy"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
