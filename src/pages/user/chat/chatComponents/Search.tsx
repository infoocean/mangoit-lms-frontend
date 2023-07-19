// import React, { useContext, useState } from "react";
// import {
//     collection,
//     query,
//     where,
//     getDocs,
//     setDoc,
//     doc,
//     updateDoc,
//     serverTimestamp,
//     getDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { Box, TextField } from "@mui/material";
// // import { AuthContext } from "../context/AuthContext";
// const Search = (currentUser:any) => {
//     const [username, setUsername] = useState<any>("");
//     const [user, setUser] = useState<any>(null);
//     const [err, setErr] = useState<any>(false);

//     //   const { currentUser } = useContext(AuthContext);
//     // console.log('currentUser', currentUser);
//     const handleSearch = async () => {
//         const q = query(
//             collection(db, "users"),
//             where("displayName", "==", username)
//         );

//         try {
//             const querySnapshot = await getDocs(q);
//             querySnapshot.forEach((doc) => {
//                 setUser(doc.data());
//             });
//         } catch (err) {
//             setErr(true);
//         }
//     };

//     const handleKey = (e:any) => {
//         e.code === "Enter" && handleSearch();
//     };

//     const handleSelect = async () => {
//         //check whether the group(chats in firestore) exists, if not create
//         const combinedId =
//             currentUser.uid > user.uid
//                 ? currentUser.uid + user.uid
//                 : user.uid + currentUser.uid;
//         try {
//             const res = await getDoc(doc(db, "chats", combinedId));

//             if (!res.exists()) {
//                 //create a chat in chats collection
//                 await setDoc(doc(db, "chats", combinedId), { messages: [] });

//                 //create user chats
//                 await updateDoc(doc(db, "userChats", currentUser.uid), {
//                     [combinedId + ".userInfo"]: {
//                         uid: user.uid,
//                         displayName: user.displayName,
//                         photoURL: user.photoURL,
//                     },
//                     [combinedId + ".date"]: serverTimestamp(),
//                 });

//                 await updateDoc(doc(db, "userChats", user.uid), {
//                     [combinedId + ".userInfo"]: {
//                         uid: currentUser.uid,
//                         displayName: currentUser.displayName,
//                         photoURL: currentUser.photoURL,
//                     },
//                     [combinedId + ".date"]: serverTimestamp(),
//                 });
//             }
//         } catch (err) { }

//         setUser(null);
//         setUsername("")
//     };
//     return (
//         <>
//             <Box >
//                 <TextField
//                     id="standard-search"
//                     value={username}
//                     variant="outlined"
//                     placeholder="Find a user"
//                     onKeyDown={handleKey}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//             </Box>
//             {err && <span>User not found!</span>}
//             {user && (
//                 <Box className="userChat" onClick={handleSelect}>
//                     <img src={user.photoURL} alt="" />
//                     <Box className="userChatInfo">
//                         <span>{user.displayName}</span>
//                     </Box>
//                 </Box>
//             )}
//         </>
//     );
// };

// export default Search;
