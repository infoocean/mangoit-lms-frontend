import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext,ChatContext } from "../index";
import { db } from "../firebase";
import { Avatar, Box } from "@mui/material";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";

const Chats = () => {
  const [chats, setChats] = useState<any>([]);
  const { data, dispatch }:any = useContext(ChatContext);
  const { currentUser }:any = useContext(AuthContext);

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

  const handleSelect = (u:any) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <>
      {Object.entries(chats)?.sort((a:any,b:any)=>b[1].date - a[1].date).map((chat:any) => (
        <Box
        sx={{display: 'flex',margin: '10px 5px'}}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <Avatar src={chat[1].userInfo.photoURL}/>
          <Box sx={{marginLeft: '10px'}}>
            <span style={{fontSize: '18px', fontWeight:' 600'}}>{capitalizeFirstLetter(chat[1].userInfo.displayName)}</span>
            <p style={{fontSize: '14px'}}>{capitalizeFirstLetter(chat[1].lastMessage?.text)}</p>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default Chats;
