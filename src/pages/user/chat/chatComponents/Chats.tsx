import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext,ChatContext } from "../index";
import { db } from "../firebase";
import { Box } from "@mui/material";

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
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <Box>
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default Chats;
