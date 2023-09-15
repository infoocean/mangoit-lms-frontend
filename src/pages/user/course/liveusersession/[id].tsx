import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import { HandleSessionGetByID } from '@/services/session';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
let room: any
let liveEndDate: any

function Live() {
  const router = useRouter();
  const { id, course_id } = router?.query;

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
        //alert before end session
        if (timeRemaining > 0) {
          setTimeout(() => {
            toast.warning('Your session will ended within 30 seconds')
          }, (timeRemaining - 30000));
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
  let meetingEnded = false; // Flag to track if the meeting has ended

  let myMeeting = (element: any) => {
    let loginUser: any
    let liveStreamerRole: any;
    let loginToken: any;
    if (typeof window !== "undefined") {
      liveStreamerRole = window.localStorage.getItem("liveStreamerRole");
      loginToken = window.localStorage.getItem("loginToken");
      loginUser = window.localStorage.getItem("userData");
    }

    if (loginToken) {

      if (liveStreamerRole === 'Host') {
        router.push(`/admin/courses/livesessions/${id}`)
      } else {
        import('@zegocloud/zego-uikit-prebuilt').then((zegoModule) => {
          // const zegoModule = await import('@zegocloud/zego-uikit-prebuilt')
          const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt
          const appID = 1495782046;
          const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
          const token = '';
          const roomID = room;
          const userID = Date.now().toString();
          const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
          const kitTokenForTest = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName)
          const kitTokenForProduction = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, userID, userName)
          const role = ZegoUIKitPrebuilt.Audience
       
          if(kitTokenForTest){
            const currentTime: any = new Date();
            const getEndADate: any = new Date(liveEndDate)
            const timeRemaining = getEndADate - currentTime;

            if (timeRemaining > 0) {
              const zp = ZegoUIKitPrebuilt.create(kitTokenForTest)
              const createRoomConfig: any = {
                container: element,
                turnOnMicrophoneWhenJoining: false,
                turnOnCameraWhenJoining: false,
                showMyCameraToggleButton: false,
                showMyMicrophoneToggleButton: false,
                showAudioVideoSettingsButton: false,
                showScreenSharingButton: false,
                showRoomTimer: true,
                onLeaveRoom: () => {
                  router.push(`/user/course/detail/${course_id}`)
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
                meetingEnded = true;
                if (meetingEnded === true) {
                  window.location.replace(`/user/course/detail/${course_id}`)
                }
              }, timeRemaining);

              localStorage.setItem('liveSteamerRole', 'Audience');
            }
            else if (timeRemaining < 0) {
              router.push(`/user/course/detail/${course_id}`)
            }
          }

        }).catch((error) => { console.log(error); });
      }
    }
    else {
      router.push('/login');
    }
  }

  return (
    <>
      <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }}>
      </div>
      <ToastContainer />
    </>
  );
}
export default Live;