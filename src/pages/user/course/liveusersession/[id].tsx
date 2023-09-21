import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
import { HandleSessionGetByID } from '@/services/session';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
let room: any
let liveEndDate: any

function Live() {
  const [loading, setLoading] = useState(false);
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
            toast.warning('Your session will ended within 5 mintutes')
          }, (timeRemaining - 300000));
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  let myMeeting = async (element: any) => {
    let loginUser: any
    let liveStreamerRole: any;
    let liveUserId: any
    let loginToken: any;
    if (typeof window !== "undefined") {
      liveStreamerRole = window.localStorage.getItem("liveStreamerRole");
      loginToken = window.localStorage.getItem("loginToken");
      liveUserId = window.localStorage.getItem("liveUserId");
      loginUser = window.localStorage.getItem("userData");
    }

    if (loginToken) {
      if (liveStreamerRole === 'Host') {
        router.push(`/admin/courses/livesessions/${id}`)
      } else {
        const zegoModule = await import('@zegocloud/zego-uikit-prebuilt')
        const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt
        const appID = 1495782046;
        const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
        const roomID = room;
        const userID = Date.now().toString();
        const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
        const kitTokenForTest = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName)
        const role = ZegoUIKitPrebuilt.Audience

        if (kitTokenForTest) {
          const currentTime: any = new Date();
          const getEndADate: any = new Date(liveEndDate)
          const timeRemaining = getEndADate - currentTime;

          if (timeRemaining > 0) {
            const zp: any = ZegoUIKitPrebuilt.create(kitTokenForTest)
            const createRoomConfig: any = {
              container: element,
              turnOnMicrophoneWhenJoining: false,
              turnOnCameraWhenJoining: false,
              showMyCameraToggleButton: false,
              showMyMicrophoneToggleButton: false,
              showAudioVideoSettingsButton: false,
              showScreenSharingButton: false,
              // screenSharingEnded:false,
              // screenSharing: false,
              showRoomTimer: true,
              onLeaveRoom: () => {
                router.push(`/user/course/detail/${course_id}`)
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
            if (zp.hasJoinedRoom === false) { setLoading(true) }
            // Set a timeout to leave the room when the specific end date is reached
            setTimeout(() => {
              zp.destroy();
              window.location.replace(`/user/course/detail/${course_id}`)
              localStorage.removeItem('liveSteamerRole')
              localStorage.removeItem('liveUserId')
            }, timeRemaining);

            localStorage.setItem('liveSteamerRole', 'Audience');
            localStorage.setItem("liveUserId", JSON.parse(loginUser)?.id)
          }
          else if (timeRemaining < 0) {
            router.push(`/user/course/detail/${course_id}`)
          }
        } else { setLoading(true) }
      }
    }
    else {
      router.push('/login');
    }
  }

  // console.log(myMeeting)

  return (
    <>
      {!loading ? <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }}>
      </div> : <SpinnerProgress />}
      <ToastContainer />
    </>
  );
}
export default Live;