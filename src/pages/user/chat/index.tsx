import { createContext, useEffect, useReducer, useState } from "react";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
//firebase imports
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
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
//Mui Components
import { Avatar, Box, Card, CardContent, Divider, Fab, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@mui/material";

//CSS stylling
import SidebarStyles from "../../../styles/sidebar.module.css";
import ChatStyle from "../../../styles/chat.module.css";

//chat components
import Messages from "./chatComponents/Messages";
import Input from "./chatComponents/Input";
import Chats from "./chatComponents/Chats";
import { makeStyles } from "@mui/styles";

export const AuthContext: any = createContext('');
export const ChatContext: any = createContext('');

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

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

  const chatReducer = (state: any, action: any) => {
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
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    setCombineIDD(combinedId);

    try {
    //check whether the group(chats in firestore) exists, if not create
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

  const classes = useStyles();
  // console.log('combineIDD',combineIDD)
  return (
    <AuthContext.Provider value={{ currentUser, combineIDD, user }}>
      <Navbar />
      <Box className={SidebarStyles.combineContentAndSidebar}>
        <SideBar />
        <Box className={SidebarStyles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Current="Chat"
            Text="CHAT"
            Link="/user/chat"
          />
          {/* main content */}
          <Card>
            <CardContent>
              <ChatContext.Provider value={{ data: state, dispatch }}>
                <Grid container component={Paper} className={classes.chatSection}>
                  <Grid item xs={12} style={{ padding: '10px' }}>
                    <TextField
                      id="standard-search"
                      value={username}
                      variant="outlined"
                      placeholder="Find a user"
                      onKeyDown={handleKey}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Divider />
                  <List>
                    {err && <span>User not found!</span>}
                    {user && (
                      <Box onClick={handleSelect}>
                        <Box
                          component="img"
                          src={user.photoURL} alt=""
                        />
                        <img src={user.photoURL} alt="" />
                        <Box className={ChatStyle.userChatInfo}>
                          <span>{user.displayName}</span>
                        </Box>
                      </Box>
                    )}
                  </List>
                  <Divider />
                  <List>
                    <Chats />
                  </List>
                  <Grid item xs={9}>
                    <List className={classes.messageArea}>
                      <ListItem key="1">
                        <Grid container>
                          <Grid item xs={12}>
                            <Messages />
                          </Grid>
                        </Grid>
                      </ListItem>
                      <Grid container style={{ padding: '20px' }}>
                        <Input />
                      </Grid>

                    </List>
                  </Grid>
                </Grid>
              </ChatContext.Provider>
            </CardContent>
          </Card>


          {/* <ChatContext.Provider value={{ data: state, dispatch }}>
            <div>

              <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>

                  <Grid item xs={12} style={{ padding: '10px' }}>
                    <TextField
                      id="standard-search"
                      value={username}
                      variant="outlined"
                      placeholder="Find a user"
                      onKeyDown={handleKey}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Divider />
                  {err && <span>User not found!</span>}
                  {user && (
                    <Box  onClick={handleSelect}>                      
                      <Avatar  src={user.photoURL} alt="" />
                      <Box className={ChatStyle.userChatInfo}>
                        <span>{user.displayName}</span>
                      </Box>
                    </Box>
                  )}
                  <List>
                    <Chats />
                  </List>
                </Grid>
                <Grid item xs={9}>
                  <Messages />
                  <Divider />
                  <Input />
        
                </Grid>
              </Grid>
            </div>
          </ChatContext.Provider> */}
        </Box>
      </Box>
    </AuthContext.Provider >
  );
}

export default Chat;