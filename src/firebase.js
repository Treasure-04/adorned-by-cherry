import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhHmHRdc9-FsvED43mrwI5CzhCWu6gN8Q",
  authDomain: "adorned-by-cherry.firebaseapp.com",
  projectId: "adorned-by-cherry",
  storageBucket: "adorned-by-cherry.firebasestorage.app",
  messagingSenderId: "1017683746189",
  appId: "1:1017683746189:web:4163af6dd7e26244e5f1c4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const ADMIN_EMAIL = "treasuredelight18@gmail.com";