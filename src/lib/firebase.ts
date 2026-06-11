import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfl6rPb2Ggj_F_CtKWaO5w-C-l7O6te-A",
  authDomain: "honurs-perde.firebaseapp.com",
  projectId: "honurs-perde",
  storageBucket: "honurs-perde.firebasestorage.app",
  messagingSenderId: "522617657293",
  appId: "1:522617657293:web:64b49fd825cb778c361684"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
