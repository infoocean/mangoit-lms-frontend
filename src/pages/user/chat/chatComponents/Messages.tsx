import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext, ChatContext} from "../index";

const Messages = (props:any) => {
  const [messages, setMessages] = useState([]);
  // const { data }:any = useContext(ChatContext);
  // const { currentUser }:any = useContext(AuthContext);
  
  useEffect(() => {
    console.log('props',props)
    const unSub = onSnapshot(doc(db, "chats", props?.data?.combineIDD), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [props]);
   //devndra-mahipal : ofjNgW15gQVhXU2xDDXTx8Ld80l2FyoVaRyU08YkgOhP01P7uzYjtVz2
  // fbqS8ITyG5aehXXxYeyHM30JuWM2DhHAS0Ao03ZPkfHUftFRQRWIx3X2
  return (
    <>
      {messages.map((m:any) => (
        <Message message={{m, props}} key={m.id} />
      ))}
    </>
  );
};

export default Messages;


