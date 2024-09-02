import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase-config.mjs';

async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "momo",
      last: "Lovelace",
      born: 1816
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addUser();