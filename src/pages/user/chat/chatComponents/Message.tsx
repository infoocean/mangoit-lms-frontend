import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ChatContext } from "../index";
import { Avatar, Box, Divider, Fab, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BASE_URL } from "@/config/config";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import messageStyle from "../../../../styles/user.module.css";
// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
//   chatSection: {
//     width: '100%',
//     height: '50vh'
//   },
//   headBG: {
//     backgroundColor: '#e0e0e0'
//   },
//   borderRight500: {
//     borderRight: '1px solid #e0e0e0'
//   },
//   messageArea: {
//     height: '20vh',
//     // overflowY: 'auto'
//   }
// });

const Message = ({ message }: any) => {
  const [rows, setRows] = useState<any>([]);
  const [loginUser, setLoginUser] = useState<any>(null);

  // console.log('message', message);
  const { currentUser }: any = useContext(AuthContext);

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
  const manageBoxData: any = (message?.m?.senderId === currentUser?.uid) ? { maxWidth: 'auto', display: 'flex', marginRight: '25px', marginLeft: '25px' } : { maxWidth: 'auto', display: 'flex', marginRight: '25px',marginLeft: '25px', flexDirection: 'row-reverse' };
  return (
    <>

      <p className={messageStyle.onHoverMessage} ref={ref} key="1" style={{paddingTop:"10px", paddingBottom:'10px',  }}>
        <Grid container >
          <Grid item xs={12} sx={manageData}>

            <Box sx={manageBoxData}>
              <Box sx={{ padding: '15px 10px' }}>
                <span style={{fontSize:'14px'}} >{message?.m?.text}</span>
              </Box>

              <Box>
       
                <Avatar
                  src={
                    message?.m?.senderId === currentUser?.uid ? `${BASE_URL}/${loginUser?.profile_pic}` : `${BASE_URL}/${message?.props?.data?.row?.profile_pic}`
                  } 
                  {...stringAvatar(loginUser?.first_name,loginUser?.last_name)}
              sx={{width: "35px",height:" 35px",fontSize: "smaller"}}
                />
                {/* <span style={{ fontSize: '12px', fontWeight: ' 600' }}>{message?.m?.senderId === currentUser?.uid ? capitalizeFirstLetter(loginUser?.first_name) : capitalizeFirstLetter(message?.props?.data?.row?.first_name)} </span> */}
              </Box>
            </Box>
          </Grid>
          {/* <Grid item xs={12}>
            <ListItemText secondary="09:30"></ListItemText>
          </Grid> */}
        </Grid>
      </p>

    </>
  );
};

export default Message;

