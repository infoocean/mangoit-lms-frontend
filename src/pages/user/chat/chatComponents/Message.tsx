import React, { useContext, useEffect, useRef } from "react";
import { AuthContext, ChatContext } from "../index";
import { Avatar, Box, Divider, Fab, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '50vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '20vh',
    // overflowY: 'auto'
  }
});

const Message = ({ message }: any) => {
  const { currentUser }: any = useContext(AuthContext);
  const { data }: any = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const classes = useStyles();
  return (
    <>
   

    <Box
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      {/* <Box className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </Box> */}
     
    <List >
      <ListItem key="1">
        <Grid container>
          <Grid item xs={12} sx={{display:'flex',flexDirection: 'row-reverse'}}>
            <Avatar src={message.img} alt=""/>
            <span >{message.text} </span>
          </Grid>
          {/* <Grid item xs={12}>
            <ListItemText secondary="09:30"></ListItemText>
          </Grid> */}
        </Grid>
      </ListItem>
     
    </List>
    

      {/* <Box className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </Box> */}
    </Box>
    </>
  );
};

export default Message;

