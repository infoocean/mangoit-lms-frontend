import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDcnWBTlKteRyy2r93SrWdTKddZX4OSrYE",
  authDomain: "chat-application-bac21.firebaseapp.com",
  projectId: "chat-application-bac21",
  storageBucket: "chat-application-bac21.appspot.com",
  messagingSenderId: "313278847308",
  appId: "1:313278847308:web:115a39f52e959024cfd7e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

let messaging: Messaging;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

//....
export const requestPermission = () => {
  console.log("Requesting User Permission......");
  if (typeof Notification !== "undefined") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification User Permission Granted.");
        return getToken(messaging, {
          vapidKey: `BIuxFRFCXnNyKaOkHQ8HcOrzeEH3k3ue9XN0HSFadv6tZw30m-ZV84mnjuKjUA9OFZa_f_yp755I6P2cW4qkrIQ`,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("Client Token: ", currentToken);
            } else {
              console.log("Failed to generate the app registration token.");
            }
          })
          .catch((err) => {
            console.log(
              "An error occurred when requesting to receive the token.",
              err
            );
          });
      } else {
        console.log("User Permission Denied.");
      }
    });
  }
};
requestPermission();

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
