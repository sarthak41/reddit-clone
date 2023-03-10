import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTCrXNSuT5vg66MFx23sxfybXvogUECgc",
  authDomain: "reddit-clone-cddf8.firebaseapp.com",
  projectId: "reddit-clone-cddf8",
  storageBucket: "reddit-clone-cddf8.appspot.com",
  messagingSenderId: "481120151837",
  appId: "1:481120151837:web:8fc70c19e591d8f083d9f4",
  measurementId: "G-41QRTSD58J",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { firestore, storage, auth };
