import React, { useContext, useEffect, useRef } from "react";
import { AuthContext, ChatContext } from "../index";
import { Avatar, Box, Divider, Fab, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BASE_URL } from "@/config/config";
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
  console.log('message', message);
  const { currentUser }: any = useContext(AuthContext);

  const ref: any = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  // const classes = useStyles();
  return (
    <>
      <Box
        ref={ref}
        className={`message ${message?.m?.senderId === currentUser.uid && "owner"}`}
      >

        <List >
          <ListItem key="1">
            <Grid container>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Avatar
                  src={
                    message?.props?.data?.row?.profile_pic
                      ? `${BASE_URL}/${message?.props?.data?.row?.profile_pic}`
                      : "/profile.png"
                  }
                />
                <span >{message?.m?.text} </span>
              </Grid>
              {/* <Grid item xs={12}>
            <ListItemText secondary="09:30"></ListItemText>
          </Grid> */}
            </Grid>
          </ListItem>

        </List>
      </Box>
    </>
  );
};

export default Message;

