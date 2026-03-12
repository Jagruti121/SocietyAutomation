import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // PASTE YOUR REAL KEYS HERE
  apiKey: "AIzaSyCELRYjd7_BxUaOE3jXBGnTdnS5Sx5gVFQ",
  authDomain: "society-automation-47770.firebaseapp.com",
  projectId: "society-automation-47770",
  storageBucket: "society-automation-47770.firebasestorage.app",
  messagingSenderId: "652693952488",
  appId: "1:652693952488:web:ebbd6bf83dec2af7d1f65d",
  measurementId: "G-B9DMMBYDWV"
};

const app = initializeApp(firebaseConfig);

// THESE EXPORTS ARE CRITICAL FOR FIXING THE ERROR
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);


