import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
import { HandleSessionGetByID } from '@/services/session';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
let room: any
let liveEndDate: any

function Live() {
  const [loading, setLoading] = useState(false);
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
            toast.warning('Your session will ended within 5 minutes')
          }, (timeRemaining - 300000));
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  let myMeeting = async (element: any) => {
    let liveStreamerRole: any;
    let liveUserId: any 
    let loginUser: any
    let loginToken: any;
    if (typeof window !== "undefined") {
      liveStreamerRole = window.localStorage.getItem("liveStreamerRole");
      liveUserId = window.localStorage.getItem("liveUserId");
      loginToken = window.localStorage.getItem("loginToken");
      loginUser = window.localStorage.getItem("userData");
    }


    if (loginToken) {

      const zegoModule = await import('@zegocloud/zego-uikit-prebuilt')
      const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt
      const appID = 1495782046;
      const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
      const roomID = room;
      const userID = Date.now().toString();  // random string
      const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
      const kitTokenForTest = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName)
      const role = ZegoUIKitPrebuilt.Host


      if (kitTokenForTest) {
        const currentTime: any = new Date();
        const getEndADate: any = new Date(liveEndDate)
        const timeRemaining = getEndADate - currentTime;
        if (timeRemaining > 0) {
          const zp: any = ZegoUIKitPrebuilt.create(kitTokenForTest)
          const createRoomConfig: any = {
            container: element,
            showRoomTimer: true,
            showRemoveUserButton: true,
            turnOnMicrophoneWhenJoining: false,
            // showPreJoinView: false,
            onLeaveRoom: () => {
              router.push('/admin/courses/livesessions/')
              localStorage.removeItem('liveSteamerRole')
              localStorage.removeItem('liveUserId')
            },
            scenario: {
              mode: ZegoUIKitPrebuilt.LiveStreamingMode.RealTimeLive,
              config: {
                role,
              },
            },
          }
          zp.joinRoom(createRoomConfig);
          if(zp.hasJoinedRoom === false) { setLoading(true) }

          // Set a timeout to leave the room when the specific end date is reached
          setTimeout(() => {
            zp.destroy();
            window.location.replace('/admin/courses/livesessions/')
            localStorage.removeItem('liveSteamerRole')
            localStorage.removeItem('liveUserId')
          }, timeRemaining);

          localStorage.setItem("liveStreamerRole", 'Host')
          localStorage.setItem("liveUserId", JSON.parse(loginUser)?.id)
        }
        else if (timeRemaining < 0) {
          router.push('/admin/courses/livesessions')
        }
      } else { setLoading(true) }

    }
    else {
      router.push('/login');
    }
  };

  return (
    <>
      {!loading ?
        <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }} >
        </div> : <SpinnerProgress />
      }
      <ToastContainer />
    </>
  );
}
export default Live;