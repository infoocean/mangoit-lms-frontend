import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import { HandleSessionGetByID } from '@/services/session';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
let room: any
let liveEndDate: any

function Live() {
  const router = useRouter();
  const { id } = router?.query;

  useEffect(() => {
    getSessionDataById(id)
  }, []);

  const getSessionDataById = async (id: any) => {
    if (id) {
      try {
        const sessionDetails = await HandleSessionGetByID(id)
        room = sessionDetails?.data?.room_id
        liveEndDate = sessionDetails?.data?.live_end_date
        const currentTime: any = new Date();
        const getEndADate: any = new Date(liveEndDate)
        const timeRemaining = getEndADate - currentTime;
        if (timeRemaining > 0) {
          //alert before end session
          setTimeout(() => {
            toast.warning('Your session will ended within 30 seconds')
          }, (timeRemaining - 30000));
        }
      } catch (e) {
        console.log(e)
      }
    }
  }


  const myMeeting = (element: any) => {
    let loginUser: any
    let loginToken: any;
    if (typeof window !== "undefined") {
      loginToken = window.localStorage.getItem("loginToken");
      loginUser = window.localStorage.getItem("userData");
    }

    if (loginToken) {
      import('@zegocloud/zego-uikit-prebuilt').then((zegoModule) => {
        // const zegoModule = await import('@zegocloud/zego-uikit-prebuilt')
        const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt
        const appID = 1495782046;
        const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
        const roomID = room;
        const randomID = Date.now().toString();
        const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
        const streamTokenData = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, serverSecret, roomID, randomID, userName)
        const role = ZegoUIKitPrebuilt.Host
        if (!streamTokenData) {
          return <Box>No Stream token Found </Box>
        }
        else {
          const currentTime: any = new Date();
          const getEndADate: any = new Date(liveEndDate)
          const timeRemaining = getEndADate - currentTime;
          if (timeRemaining > 0) {
            const zp: any = ZegoUIKitPrebuilt.create(streamTokenData)
            const createRoomConfig: any = {
              container: element,
              showRoomTimer: true,
              showRemoveUserButton: true,
              onLeaveRoom: () => {
                router.push('/admin/courses/livesessions/')
              },
              scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreamingMode.RealTimeLive,
                config: {
                  role,
                },
              },
            }
            zp.joinRoom(createRoomConfig);

            // Set a timeout to leave the room when the specific end date is reached
            setTimeout(() => {
              zp.destroy();
              window.location.replace('/admin/courses/livesessions/')
            }, timeRemaining);

            localStorage.setItem("liveStreamerRole", 'Host')

          }
          else if (timeRemaining < 0) {
            router.push('/admin/courses/livesessions')
          }
        }
      }).catch((error) => { console.log(error); });

    }
    else {
      router.push('/login');
    }
  };

  return (
    <>
      <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }} >
      </div>
      <ToastContainer />
    </>
  );
}
export default Live;
