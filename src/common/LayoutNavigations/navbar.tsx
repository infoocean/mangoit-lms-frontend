import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useProSidebar } from "react-pro-sidebar";
import { Avatar, Badge, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import styles from "../../styles/appbar.module.css";
import { HandleLogout } from "@/services/auth";
import { capitalizeFirstLetter } from "../CapitalFirstLetter/capitalizeFirstLetter";
import { BASE_URL } from "@/config/config";
import Link from "next/link";
import { HandleSiteGetByID } from "@/services/site";
import { AuthContext, ChatContext } from "../../pages/user/chat/index";

interface appbar {
  portalData?: any;
  profilePic?: any;
  firstName?: any;
  lastName?: any;
}

function stringAvatar(first_name: string, last_name: string) {
  return {
    sx: {
      bgcolor: "#e8661b",
    },
    children: `${capitalizeFirstLetter(
      first_name?.split(" ")[0][0]
    )}${capitalizeFirstLetter(last_name?.split(" ")[0][0])}`,
  };
}

export default function Navbar({
  portalData,
  profilePic,
  firstName,
  lastName,
}: appbar) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orgLogo, setOrgLogo] = React.useState<string>("");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [userData, setUserData] = React.useState<any>("");
  const { collapseSidebar, toggleSidebar, toggled } = useProSidebar();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { chats,setLiveChatDetail }: any = React.useContext(ChatContext);
  const { currentUser }: any = React.useContext(AuthContext);
  const [notification, setNotification] = React.useState(false);
  const router = useRouter();




  React.useEffect(() => {
    setLiveChatDetail({})
    let localData: any, parseLocalData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    if (localData) {
      parseLocalData = JSON.parse(localData);
      setUserData(JSON.parse(localData));
    }

    handleGetSiteOptionsDataById(parseLocalData.id);
  }, []);
  // console.log('currentUser', currentUser?.uid);
  // if (currentUser?.uid !== chats?.userInfo?.uid) {
  //   // setNotification(true)
  //   console.log('setNotification true')
  // }

  const handleGetSiteOptionsDataById = async (userId: any) => {
    await HandleSiteGetByID(userId)
      .then((res) => {
        const hasOLOrOFOrT = res.data.filter(
          (item: any) => item.key === "org_logo"
        );

        setOrgLogo(hasOLOrOFOrT && hasOLOrOFOrT[0]?.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      collapseSidebar();
    } else {
      collapseSidebar();
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      sx={{ marginTop: "25px !important" }}
      onClose={handleMenuClose}
    >
      {userData && userData?.role_id === 1 ? (
        <Box>
          <MenuItem
            onClick={() => {
              router.push("/profile"), handleMenuClose();
            }}
          >
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/"), handleMenuClose();
            }}
          >
            <Typography>View Site</Typography>
          </MenuItem>
        </Box>
      ) : (
        <Box>
          <MenuItem
            onClick={() => {
              router.push("/user/profile"), handleMenuClose();
            }}
          >
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/"), handleMenuClose();
            }}
          >
            <Typography>View Site</Typography>
          </MenuItem>
        </Box>
      )}
      <MenuItem onClick={HandleLogout}>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      sx={{ marginTop: "25px !important" }}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => router.push("/profile")}>
        <Typography variant="body1">Welcome</Typography>&nbsp;
        <Typography variant="body2">
          {capitalizeFirstLetter(userData?.first_name)}{" "}
          {capitalizeFirstLetter(userData?.last_name)}
        </Typography>
      </MenuItem>

      <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
      <MenuItem onClick={() => router.push("/")}>View Site</MenuItem>
      <MenuItem onClick={HandleLogout}>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  // console.log(chats)


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.appBarCss}>
        <Toolbar>
          <Link href="/">
            <Box
              component="img"
              src={
                portalData
                  ? BASE_URL + "/" + portalData?.org_logo
                  : orgLogo
                    ? BASE_URL + "/" + orgLogo
                    : "/Images/pages_icon/company_logo.png"
              }
              width={"180px"}
              height={"50px"}
              sx={{ display: { xs: "block", sm: "block" } }}
              alt="Company logo"
            />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ margin: '10px' }}>
              {chats?.lastMessage?.text ? <Badge color="secondary" variant="dot">
                <NotificationsNoneIcon />
              </Badge> : <NotificationsNoneIcon />}
            </Box>
            <Box className={styles.createVrLine}></Box>

            <Avatar
              src={
                profilePic && profilePic
                  ? `${BASE_URL}/${profilePic}`
                  : userData && userData?.profile_pic !== null
                    ? `${BASE_URL}/${userData?.profile_pic}`
                    : "/"
              }
              {...stringAvatar(userData?.first_name, userData?.last_name)}
              alt={userData && userData?.first_name}
              className={styles.windowFullWidthAvatar}
            />
            <Typography
              variant="body2"
              className={styles.windowFullWidthNameAlign}
            >
              {capitalizeFirstLetter(
                firstName && firstName ? firstName : userData?.first_name
              )}{" "}
              {capitalizeFirstLetter(
                lastName && lastName ? lastName : userData?.last_name
              )}
            </Typography>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon
                onClick={() => {
                  toggle();
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
