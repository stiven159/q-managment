// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV-1BOziuET-FAlgIVCyqTz5VePyTPsAA",
  authDomain: "queue-management-system-f90a1.firebaseapp.com",
  projectId: "queue-management-system-f90a1",
  storageBucket: "queue-management-system-f90a1.appspot.com",
  messagingSenderId: "609343869853",
  appId: "1:609343869853:web:ff7cd16831fffb786d5574",
  measurementId: "G-EVP9PL8JBH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
