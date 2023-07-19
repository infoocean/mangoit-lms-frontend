import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../index";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";

const Message = (props:any) => {
  const { currentUser }:any = useContext(AuthContext);
 

  // const { data } = useContext(ChatContext);
  const ref = useRef();
// const currentUser = props.currentUser
  useEffect(() => {
    // ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.message]);
// console.log('uuuuuu', props.currentUser)
  return (
    <div
      // ref={ref}
      className={`message ${props.message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            props.message.senderId === currentUser.uid
              ? currentUser.photoURL
              : props.data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{props.message.text}</p>
        {props.message.img && <img src={props.message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;

