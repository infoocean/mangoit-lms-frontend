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
  arrayUnion,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuid } from "uuid";
import { Avatar, Box, Button, Card, CardContent, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SearchOutlined } from "@mui/icons-material";
import List, { ListClassKey } from '@mui/material/List';
import { createContext, useEffect, useReducer, useState } from "react";
import SidebarStyles from "../../../styles/sidebar.module.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Messages from "./chatComponents/Messages";
// import Input from "./chatComponents/Input";
import Chats from "./chatComponents/Chats";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { BASE_URL } from "@/config/config";
import { getUserChats } from "./firebaseFunctions";
export const AuthContext: any = createContext('');
export const ChatContext: any = createContext('');

const Chat = () => {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<any>([]);
  const [row, setRow] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({});
  // const [username, setUsername] = useState<any>("");
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<any>(false);
  const [combineIDD, setCombineIDD] = useState<any>(null);
  const [allchats, setChats] = useState<any>([]);
  const [chatsUsers, setChatUsers] = useState<any>([]);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (getUser: any) => {
      setCurrentUser(getUser);
      getUsereData();
      getAllChatUsers();
    });
    return () => {
      unsub();
    };
  }, []);

  const getUsereData = () => {
    HandleUserGet("", "").then((users) => {
      setRows(users.data);
    });
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  console.log('allchats',allchats)
  
  // const userChats = getUserChats(currentUser)
  // console.log("ddattt,",getchats)
  const getAllChatUsers = async () => {
    const colRef = collection(db, "userChats")
    const docsSnap = await getDocs(colRef);
    docsSnap.forEach(doc => {
      setChatUsers(doc.data());
    })
  }
  
  console.log('chatsUsers',chatsUsers)

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

  const handleSearch = (e: any, identifier: any) => {

    if (identifier === "reset") {
      HandleUserGet("", "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
      setSearch(e);
    } else {
      const search = e.target.value;
      setSearch(e.target.value);
      HandleUserGet(search, "").then((itemSeached) => {
        setRows(itemSeached.data);
      });
    }
  };

  const handleclick = async (e: any) => {
    console.log('eeee',e?.email)
    setRow(e)
    let user: any
    const q = query(
      collection(db, "users"),
      where("email", "==", e?.email)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        user = doc.data();
        setUser(doc.data())
      });
    } catch (err) {
      setErr(true);
    }

    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid
        : user?.uid + currentUser?.uid

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
  }

  const handleSend = async () => {
    const messages = await updateDoc(doc(db, "chats", combineIDD), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    const chats = await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combineIDD + ".lastMessage"]: {
        text,
      },
      [combineIDD + ".userInfo"]: {
        uid: user.uid,
        displayName: user.displayName,
      },
      [combineIDD + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.uid), {
      [combineIDD + ".lastMessage"]: {
        text,
      },
      [combineIDD + ".userInfo"]: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
      },
      [combineIDD + ".date"]: serverTimestamp(),
    });

    setText("");
    // setImg(null);
  };

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
          <ChatContext.Provider value={{ data: state, dispatch }}>
            <Box sx={{ maxWidth: 'auto', display: 'flex', }}>
              <Box sx={{ width: '300px' }}>
                <Box>
                  <TextField
                    id="standard-search"
                    value={search}
                    variant="outlined"
                    placeholder="Find a user"
                    onChange={(e) => handleSearch(e, "")}
                    InputProps={{
                      endAdornment: !search ? (
                        <IconButton>
                          <SearchOutlined />
                        </IconButton>
                      ) : (
                        <IconButton onClick={(e) => handleSearch("", "reset")}>
                          {" "}
                          <CloseIcon />
                        </IconButton>
                      ),
                    }}
                  />

                  < TableContainer sx={{ width: '275px' }}>
                    <Table>
                      <TableBody>
                        {rows.map((row: any) => (
                          <TableRow
                            hover
                            key={row?.id}
                            onClick={() => { handleclick(row) }}
                          >
                            <TableCell sx={{ display: 'flex' }}
                            >
                              <Avatar
                                src={
                                  row?.profile_pic
                                    ? `${BASE_URL}/${row.profile_pic}`
                                    : "/profile.png"
                                }
                              />
                              {row?.first_name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* <Chats /> */}
                </Box>
              </Box>

              <Box sx={{ width: '890px' }}>
                {/* <Input /> */}
                {user && (
                  <Box>
                    <Box sx={{ float: "left" }}>
                      <Avatar src={
                        row?.profile_pic
                          ? `${BASE_URL}/${row.profile_pic}`
                          : "/profile.png"
                      } />
                      {row?.first_name}
                    </Box>
                    {/* ----------------- Messages component --------------------------- */}
                    <Messages
                      data={{ combineIDD, row }}
                    />
                    { /*---------------- input field for send messages ------------------ */}
                    <TextField
                      id="standard-search"
                      value={text}
                      variant="outlined"
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type something..."
                      fullWidth
                    />
                    <Button
                      // id={sidebarStyles.muibuttonBackgroundColor}
                      onClick={handleSend}>Send
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </ChatContext.Provider>
        </Box>
      </Box >
    </AuthContext.Provider >
  );
}

export default Chat;