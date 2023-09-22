import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ChatContext } from "../index";
import { Alert, Avatar, Box, Button, Divider, Fab, Grid, IconButton, List, ListItem, ListItemText, Stack, TableCell, TextField, Tooltip, Typography } from "@mui/material";
import { BASE_URL } from "@/config/config";
import { HandleUserGet } from "@/services/user";
import { capitalizeFirstLetter } from "@/common/CapitalFirstLetter/capitalizeFirstLetter";
import messageStyle from "../../../../styles/user.module.css";
import { MyChatContext } from "@/GlobalStore/MyContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Toaster, toast } from "react-hot-toast";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(8),
    border: '1px solid #dadde9',
    padding: 5
  },
}));

const Message = ({ message }: any) => {
  const [value, setValue] = React.useState("");
  const [edit, setedit] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<any>(null);
  const [dt, setdt] = useState<any>("");
  // console.log('message', message);
  const { currentUser, chatId }: any = useContext(AuthContext);
  const ref: any = useRef();
  useEffect(() => {
    const dtt: any = localStorage.getItem("userData")
    setdt(JSON.parse(dtt));
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
    });
  }

  //copy text message
  const CopyTextMessage = (message: any) => {
    navigator.clipboard.writeText(message?.m?.text)
    toast.success('Message copied!')
  }
  //edit text message
  const EditTextMessage = (message: any) => {
    setValue(message?.m?.text);
    setedit(true)
  }
  //edit text message
  const DeleteTextMessage = (message: any) => {

    console.log(message)
  }

  const InlineEdit = ({ value, setValue }: any) => {
    const [editingValue, setEditingValue] = React.useState(value);
    const onChange = (event: any) => setEditingValue(event.target.value);
    const onKeyDown = (event: any) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.target.blur();
        
      }
    };
    const onBlur = (event: any) => {
      if (event.target.value.trim() === "") {
        setEditingValue(value);
      } else {
        setValue(event.target.value);
      }
    };
    return (
      <input
        type="text"
        aria-label="Field name"
        value={editingValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    );
  };

  return (
    <>
      <p className={messageStyle.onHoverMessage} ref={ref} key="1" style={{ paddingTop: "10px", paddingBottom: '10px', }}>
        <Grid container onClick={() => messageRead(message)} >
          <Grid item xs={12} sx={manageData}>
            {message.m.senderId === dt.firebase_id ? (
              <HtmlTooltip
                placement="left-start"
                title={
                  <React.Fragment>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton aria-label="copy" size="small" onClick={() => CopyTextMessage(message)}>
                        <ContentCopyOutlinedIcon fontSize="small" style={{ color: "black" }} />
                      </IconButton>
                      <IconButton aria-label="edit" size="small" onClick={() => EditTextMessage(message)}>
                        <ModeEditOutlineIcon fontSize="small" style={{ color: "black" }} />
                      </IconButton>
                      <IconButton aria-label="delete" size="small" onClick={() => DeleteTextMessage(message)}>
                        <DeleteOutlineIcon fontSize="small" style={{ color: "black" }} />
                      </IconButton>
                    </Stack>
                  </React.Fragment>
                }
              >
                <Box sx={manageBoxData}>
                  {edit ? <InlineEdit value={value} setValue={setValue} /> : <Box sx={{ padding: '2px 10px', textAlign: "justify", }}>
                    {message?.m?.text}
                  </Box>}
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
              </HtmlTooltip>) :
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
            }
          </Grid>
        </Grid>
      </p >
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
};

export default Message;

