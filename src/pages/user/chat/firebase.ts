import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgYPla_fppmwOfU1tyoasvkZKtxmUJz2o",
  authDomain: "react-chat-app-7b926.firebaseapp.com",
  projectId: "react-chat-app-7b926",
  storageBucket: "react-chat-app-7b926.appspot.com",
  messagingSenderId: "349456336711",
  appId: "1:349456336711:web:8f311b5ee5e485595cee62",

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()