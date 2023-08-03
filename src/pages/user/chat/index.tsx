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
import { createContext, useEffect, useReducer, useState } from "react";
import SidebarStyles from "../../../styles/sidebar.module.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Messages from "./chatComponents/Messages";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import { BASE_URL } from "@/config/config";
export const AuthContext: any = createContext('');
export const ChatContext: any = createContext('');

const Chat = () => {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<any>([]);
  const [row, setRow] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<any>(false);
  const [combineIDD, setCombineIDD] = useState<any>(null);
  const [allchats, setChats] = useState<any>([]);
  const [liveChatDetail, setLiveChatDetail] = useState<any>([]);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (getUser: any) => {
      setCurrentUser(getUser);
      getUsereData();
    });
    return () => {
      unsub();
    };
  }, []);

  const getUsereData = () => {
    HandleUserGet("", "").then((users) => {
      let localData: any;
      if (typeof window !== "undefined") {
        localData = window.localStorage.getItem("userData");
      }
      const LoginUser = JSON.parse(localData)
      if (LoginUser) {
        const dataUsers = users?.data?.filter((user: { id: any; }) => user.id !== LoginUser?.id)
        dataUsers.sort((a: any, b: any) => a.first_name.localeCompare(b.first_name));
        setRows(dataUsers);
      }
    });
  };


  useEffect(() => {
    const getChats = () => {
      if (!currentUser.uid) {
        return;
      }
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data: any = doc.data();
        setChats(data);
        const chatEntries: any = Object.entries(data).map((chat) => chat[1]);
        const greatestDateObject = chatEntries.reduce((greatest: any, current: any) => {
          if (current.date) {
            const currentDateTime = new Date(current.date.seconds * 1000 + current.date.nanoseconds / 1000000);
            if (!greatest || currentDateTime > new Date(greatest.date.seconds * 1000 + greatest.date.nanoseconds / 1000000)) {
              return current;
            }
          }
          return greatest;
        }, null);
        setLiveChatDetail(greatestDateObject);
      });
      return () => {
        unsub();
      };
    };
    getChats();
  }, [currentUser.uid]);


  // console.log('notiflivecation', live)

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
    // console.log('eeee', e?.firebase_id)
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
    setLiveChatDetail('')
  }
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };


  const handleSend = async () => {
    if (text.length > 0) {
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
          email: user.email,
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
          email: currentUser.email,
        },
        [combineIDD + ".date"]: serverTimestamp(),
      });

      setText("");
      // setImg(null);

    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, combineIDD, user }}>
      <ChatContext.Provider value={{ data: state, dispatch, chats: liveChatDetail, setLiveChatDetail }}>
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

            <Box sx={{ maxWidth: 'auto', display: 'flex', }}>
              <Box sx={{ width: '300px' }}>
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

                {/* ---------------------------------  all  chats---------------------------------- */}
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
                          // onClick={changeTextColor}
                          >
                            <Avatar
                              src={
                                row?.profile_pic
                                  ? `${BASE_URL}/${row.profile_pic}`
                                  : "/profile.png"
                              }
                            />
                            <span style={{ fontSize: '17px', fontWeight: ' 600', padding: '5px' }}>{capitalizeFirstLetter(row?.first_name)}</span>
                            {row?.firebase_id === liveChatDetail?.userInfo?.uid ?
                              <Typography
                                sx={{ color: '#d32f2f', fontSize: '14px', paddingTop: '10px' }}
                              >{(liveChatDetail?.lastMessage?.text).slice(0, 10).concat(' ...')}</Typography> : ''}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <Chats /> */}
              </Box>

              {/* ---------------------- chat user ------------------------------------------- */}
              {user && (
                <Box sx={{ width: '100%', background: '#ffffffb0', height: '80vh' }}>
                  <Box sx={{
                    background: '#ffffffb0',
                    paddingLeft: '25px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid lightgrey',

                  }}>
                    <Avatar src={
                      row?.profile_pic
                        ? `${BASE_URL}/${row.profile_pic}`
                        : "/profile.png"
                    } />
                    <span style={{ fontSize: '17px', fontWeight: ' 600' }}>{capitalizeFirstLetter(row?.first_name)}</span>
                  </Box>
                  {/* ----------------- Messages component --------------------------- */}
                  <Box className="messagebox" sx={{ height: '437px', overflow: 'auto' }} >
                    <Messages
                      data={{ combineIDD, row }}
                    />
                  </Box>
                  { /*---------------- input field for send messages ------------------ */}
                  <Box sx={{
                    position: 'fixed',
                    top: '650px',
                    right: '10px',
                    padding: '6px',
                    color: '#fff',
                    width: '890px',
                    display: 'flex',
                  }}>
                    <TextField
                      id="standard-search"
                      value={text}
                      variant="outlined"
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type something..."
                      fullWidth
                    />
                    <Button
                      // id={sidebarStyles.muibuttonBackgroundColor}
                      onClick={handleSend}>Send
                    </Button>
                  </Box>
                </Box>
              )}

            </Box>
          </Box>
        </Box >
      </ChatContext.Provider>
    </AuthContext.Provider >
  );
}

export default Chat;