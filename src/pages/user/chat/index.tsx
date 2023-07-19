import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Box, Card, CardContent, Grid, IconButton, TextField, Typography } from "@mui/material";
import { createContext, useEffect, useReducer, useState } from "react";
import SidebarStyles from "../../../styles/sidebar.module.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Messages from "./chatComponents/Messages";
import Input from "./chatComponents/Input";
import Chats from "./chatComponents/Chats";
export const AuthContext: any = createContext('');
export const ChatContext :any = createContext('');

const Chat = () => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [username, setUsername] = useState<any>("");
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<any>(false);
  const [combineIDD, setCombineIDD] = useState<any>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (getUser: any) => {
      setCurrentUser(getUser);
    });
    return () => {
      unsub();
    };
  }, []);

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state:any, action:any) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);


  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e: any) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    setCombineIDD(combinedId);

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) { }

    setUser(null);
    setUsername("")
  };
  // console.log('combineIDD',combineIDD)
  return (
    <AuthContext.Provider value={{ currentUser, combineIDD, user }}>

      <Navbar />
      <Box className={SidebarStyles.combineContentAndSidebar}>
        <SideBar />
        {/* main content */}
        <Box className={SidebarStyles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Chat"
            Text="CHAT"
            Link="/user/chat"
          />
          {/* main content */}
          <ChatContext.Provider value={{ data:state, dispatch }}>
            <Box>
              <Box >
                <TextField
                  id="standard-search"
                  value={username}
                  variant="outlined"
                  placeholder="Find a user"
                  onKeyDown={handleKey}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Box>
              {err && <span>User not found!</span>}
              {user && (
                <Box className="userChat" onClick={handleSelect}>
                  <img src={user.photoURL} alt="" />
                  <Box className="userChatInfo">
                    <span>{user.displayName}</span>
                  </Box>
                </Box>
              )}
              <Chats />
            </Box>

            <Box sx={{ float: 'right' }}>

              <Messages
                data={combineIDD}
                currentUser={currentUser}
              />

              <Input
                currentUser={currentUser}
              // data={user}
              />
            </Box>
          </ChatContext.Provider>
        </Box>
      </Box>
    </AuthContext.Provider>
  );
}

export default Chat;