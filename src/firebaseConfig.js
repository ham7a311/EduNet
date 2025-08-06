import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyAKyFwUpeCZbabqyWy5gnuenSBUB2eBJ6Q",
    authDomain: "edunet-86992.firebaseapp.com",
    projectId: "edunet-86992",
    storageBucket: "edunet-86992.firebasestorage.app",
    messagingSenderId: "720578463622",
    appId: "1:720578463622:web:346e619e3c8e47d9aece07",
    measurementId: "G-DFLV2PY7XQ"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1');