import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const CurrentUser = () => {
    onAuthStateChanged(auth, (getUser) => {
         console.log(getUser);
    });
}

export const CreateFirebase = async (event: any) => {
    const displayName = event?.first_name;
    const email = event?.email;
    const password = event?.password;
    const res = await createUserWithEmailAndPassword(auth, email, password);

    //create user on firestore
    await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
    });
    //create empty user chats on firestore
    await setDoc(doc(db, "userChats", res.user.uid), {});
}

export const LoginFirestore = async (event: any) => {
    const email = event?.email;
    const password = event?.password;
    await signInWithEmailAndPassword(auth, email, password);
}
