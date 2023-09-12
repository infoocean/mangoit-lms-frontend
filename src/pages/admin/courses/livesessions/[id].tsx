import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import { HandleSessionGetByID } from '@/services/session';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

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
      } catch (e) {
        console.log(e)
      }
    }
  }

  let meetingEnded = false; // Flag to track if the meeting has ended

  let myMeeting = async (element: HTMLDivElement) => {
    let loginUser: any
    let loginToken: any;
    if (typeof window !== "undefined") {
      loginToken = window.localStorage.getItem("loginToken");
      loginUser = window.localStorage.getItem("userData");
    }

    if (loginToken) {

      const module = await import('@zegocloud/zego-uikit-prebuilt')
      const ZegoUIKitPrebuilt = module.ZegoUIKitPrebuilt
      const appID = 1495782046;
      const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
      const roomID = room;
      const randomID = Date.now().toString();
      const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
      const streamTokenData = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)
      const role = ZegoUIKitPrebuilt.Host

      if (!streamTokenData) {
        return <Box>No Stream token Found </Box>
      }
      else {
        const currentTime: any = new Date();
        const getEndADate: any = new Date(liveEndDate)
        const timeRemaining = getEndADate - currentTime;


        if (timeRemaining > 0) {
          const zp = ZegoUIKitPrebuilt.create(streamTokenData)

          const createRoomConfig: any = {
            container: element,
            showRoomTimer: true,
            onLeaveRoom: () => {
              router.push('/admin/courses/livesessions/')
            },
            scenario: {
              mode: ZegoUIKitPrebuilt.LiveStreamingMode,
              config: {
                role,
              },
            },
          }
          zp.joinRoom(createRoomConfig);

          localStorage.setItem("liveStreamerRole", 'Host')

          // Set a timeout to leave the room when the specific end date is reached
          setTimeout(() => {
            zp.destroy();
            meetingEnded = true;
            if (meetingEnded === true) {
              window.location.replace('/admin/courses/livesessions/')
            }
          }, timeRemaining);

        }
        else if (timeRemaining < 0) {
          router.push('/admin/courses/livesessions')
        }
      }
    }
    else {
      router.push('/login');
    }
  };

  return (
    <>
      {!meetingEnded ? <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }} > </div>
        : <div>End Meeting</div>}

    </>
  );
}

export default Live;
