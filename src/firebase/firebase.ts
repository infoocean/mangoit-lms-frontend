import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcnWBTlKteRyy2r93SrWdTKddZX4OSrYE",
  authDomain: "chat-application-bac21.firebaseapp.com",
  projectId: "chat-application-bac21",
  storageBucket: "chat-application-bac21.appspot.com",
  messagingSenderId: "313278847308",
  appId: "1:313278847308:web:115a39f52e959024cfd7e9",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
