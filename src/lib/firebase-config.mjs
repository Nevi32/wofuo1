import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfcSn4zvVcuPiQG2Yy5lz0akPLgwY3Eq8",
  authDomain: "chatapp-da47a.firebaseapp.com",
  projectId: "chatapp-da47a",
  storageBucket: "chatapp-da47a.appspot.com",
  messagingSenderId: "1095806424028",
  appId: "1:1095806424028:web:bc1ea58aa8447b75c6f519",
  measurementId: "G-D91HHC1ESX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
