// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADZbmZb2K5kahlOvvdWaL91q4fc0UGnwY",
  authDomain: "crossmint-f2561.firebaseapp.com",
  projectId: "crossmint-f2561",
  storageBucket: "crossmint-f2561.appspot.com",
  messagingSenderId: "679889282194",
  appId: "1:679889282194:web:ebe1e6dbfe33d79d8f724b",
  measurementId: "G-N4ZW4FNBD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, auth, storage};