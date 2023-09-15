import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ChatContext } from "../index";
import { Avatar, Box, Divider, Fab, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import { BASE_URL } from "@/config/config";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import messageStyle from "../../../../styles/user.module.css";
import { MyChatContext } from "@/GlobalStore/MyContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Message = ({ message }: any) => {
  const [rows, setRows] = useState<any>([]);
  const [loginUser, setLoginUser] = useState<any>(null);
  // console.log('message', message);
  const { currentUser, chatId }: any = useContext(AuthContext);
  const ref: any = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    getUsereData();
  }, [message]);

  const getUsereData = () => {
    HandleUserGet("", "").then((users) => {
      let localData: any;
      if (typeof window !== "undefined") {
        localData = window.localStorage.getItem("userData");
      }
      const LoginUser = JSON.parse(localData)
      setLoginUser(LoginUser)
    });
  }
  function stringAvatar(first_name: string, last_name: string) {
    return {
      children: `${capitalizeFirstLetter(
        first_name?.split(" ")[0][0]
      )}${capitalizeFirstLetter(last_name?.split(" ")[0][0])}`,
    };
  }
  const manageData: any = (message?.m?.senderId === currentUser?.uid) ? { display: 'flex', flexDirection: 'row-reverse' } : { display: 'flex', justifyContent: "left" };
  const manageBoxData: any = (message?.m?.senderId === currentUser?.uid) ? { maxWidth: 'auto', display: 'flex', marginRight: '25px', marginLeft: '25px', background: "#ef590640 ", padding: "10px", borderRadius: "15px 0px 15px 15px" } : { maxWidth: 'auto', display: 'flex', marginRight: '25px', marginLeft: '25px', flexDirection: 'row-reverse', background: "#9292923b", padding: "10px", borderRadius: "0px 15px 15px 15px" };

  const messageRead = async (e: any) => {
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [e?.props?.data?.combineIDD + ".userInfo.isRead"]: 1,
    }).catch((e) => {
      console.log(e);
    });;
  }

  return (
    <>
      <p className={messageStyle.onHoverMessage} ref={ref} key="1" style={{ paddingTop: "10px", paddingBottom: '10px', }}>
        <Grid container onClick={() => messageRead(message)} >
          <Grid item xs={12} sx={manageData}>
            <Box sx={manageBoxData}>
              <Box sx={{ padding: '2px 10px', textAlign: "justify", }}>
                {message?.m?.text}
              </Box>
              <Box>
                {
                  chatId?.firebase_id === message?.m?.senderId ? (<Avatar
                    src={
                      message?.m?.senderId === currentUser?.uid ? `${BASE_URL}/${loginUser?.profile_pic}` : `${BASE_URL}/${message?.props?.data?.row?.profile_pic}`
                    }
                    {
                    ...stringAvatar(message?.props?.data?.row?.first_name, message?.props?.data?.row?.last_name)}
                    sx={{ width: "25px", height: "25px", fontSize: "10px" }}
                  />) : (<Avatar
                    src={
                      message?.m?.senderId === currentUser?.uid ? `${BASE_URL}/${loginUser?.profile_pic}` : `${BASE_URL}/${message?.props?.data?.row?.profile_pic}`
                    }
                    {
                    ...stringAvatar(loginUser?.first_name, loginUser?.last_name)}
                    sx={{ width: "35px", height: " 35px", fontSize: "smaller" }}
                  />)
                }
              </Box>
            </Box>
          </Grid>
        </Grid>
      </p>

    </>
  );
};

export default Message;

