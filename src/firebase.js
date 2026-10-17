// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBk8xwCr-PZdzlsFIp09w5VGrbUuovJ2Vo",
  authDomain: "salwa-portofolio.firebaseapp.com",
  projectId: "salwa-portofolio",
  storageBucket: "salwa-portofolio.firebasestorage.app",
  messagingSenderId: "218531602699",
  appId: "1:218531602699:web:9ab91993f6e396741b820e",
  measurementId: "G-PD3G7FRW25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);