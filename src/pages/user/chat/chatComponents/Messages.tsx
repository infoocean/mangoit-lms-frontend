import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext, ChatContext} from "../index";

const Messages = (props:any) => {
  const [messages, setMessages] = useState([]);
  const { data, dispatch }:any = useContext(ChatContext);
  const { currentUser }:any = useContext(AuthContext);
  
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // fbqS8ITyG5aehXXxYeyHM30JuWM2DhHAS0Ao03ZPkfHUftFRQRWIx3X2
  return (
    <>
      {messages.map((m:any) => (
        <Message message={m} key={m.id} currentUser={props.currentUser}/>
      ))}
    </>
  );
};

export default Messages;


