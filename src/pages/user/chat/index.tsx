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
    setRow(e)
    let user: any
    const q = query(
      collection(db, "users"),
      where("displayName", "==", e?.first_name)
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
    await updateDoc(doc(db, "chats", combineIDD), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combineIDD + ".lastMessage"]: {
        text,
      },
      [combineIDD + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.uid), {
      [combineIDD + ".lastMessage"]: {
        text,
      },
      [combineIDD + ".date"]: serverTimestamp(),
    });

    setText("");
    // setImg(null);
  };

  // const handleSearch = async () => {
  //   const q = query(
  //     collection(db, "users"),
  //     where("displayName", "==", username)
  //   );

  //   try {
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       setUser(doc.data());
  //     });
  //   } catch (err) {
  //     setErr(true);
  //   }
  // };

  // const handleKey = (e: any) => {
  //   e.code === "Enter" && handleSearch();
  // };

  // const handleSelect = async () => {
  //   //check whether the group(chats in firestore) exists, if not create
  //   const combinedId =
  //     currentUser.uid > user.uid
  //       ? currentUser.uid + user.uid
  //       : user.uid + currentUser.uid;

  //   setCombineIDD(combinedId);

  //   try {
  //     const res = await getDoc(doc(db, "chats", combinedId));

  //     if (!res.exists()) {
  //       //create a chat in chats collection
  //       await setDoc(doc(db, "chats", combinedId), { messages: [] });

  //       //create user chats
  //       await updateDoc(doc(db, "userChats", currentUser.uid), {
  //         [combinedId + ".userInfo"]: {
  //           uid: user.uid,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });

  //       await updateDoc(doc(db, "userChats", user.uid), {
  //         [combinedId + ".userInfo"]: {
  //           uid: currentUser.uid,
  //           displayName: currentUser.displayName,
  //           photoURL: currentUser.photoURL,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });
  //     }
  //   } catch (err) { }

  //   setUser(null);
  //   setUsername("")
  // };
  // console.log('user33', row)
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
            <Box sx={{maxWidth:'auto', display:'flex',}}>
              <Box sx={{width:'300px'}}>
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
                  {/* // <TableBody>
                  //   <TableRow>
                  //     <TableCell>
                  //       {capitalizeFirstLetter(row?.first_name)}
                  //     </TableCell>
                  //   </TableRow>
                  // </TableBody> */}

                  {/* <TextField
                  id="standard-search"
                  value={username}
                  variant="outlined"
                  placeholder="Find a user"
                  onKeyDown={handleKey}
                  onChange={(e) => setUsername(e.target.value)}
                /> */}
                </Box>


                {/* {err && <span>User not found!</span>}
              {user && (
                <Box className="userChat" onClick={handleSelect}>
                  <img src={user.photoURL} alt="" />
                  <Box className="userChatInfo">
                    <span>{user.displayName}</span>
                  </Box>
                </Box>
              )} */}
                {/* <Chats /> */}
              </Box>

              <Box sx={{width:'890px'}}>
                {/* <Input /> */}
                {user && (
                  <Box>
                    <Box sx={{ float: "left" }}>
                      <Avatar src={
                        row?.profile_pic
                          ? `${BASE_URL}/${row.profile_pic}`
                          : "/profile.png"
                      } />
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