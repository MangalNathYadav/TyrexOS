import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAXTr2srajicaga2Cta-2E47mjawMUSvAs",
  authDomain: "e-learning-ac62a.firebaseapp.com",
  databaseURL: "https://e-learning-ac62a.firebaseio.com",
  projectId: "e-learning-ac62a",
  storageBucket: "e-learning-ac62a.firebasestorage.app",
  messagingSenderId: "208704804421",
  appId: "1:208704804421:web:d161347f8d725d5ee8352c"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
