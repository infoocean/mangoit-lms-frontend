import { capitalizeFirstLetter } from '@/common/CapitalFirstLetter/capitalizeFirstLetter';
import { HandleSessionGetByID } from '@/services/session';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
let room:any

function Live() {
  const router = useRouter();
  const { id } = router?.query;

  useEffect(() => {
    getSessionDataById(id)
  },[]);

  const getSessionDataById = async (id:any) => {
    if(id) {
      try{
      const sessionDetails =  await HandleSessionGetByID(id)
      room = sessionDetails?.data?.room_id    
      }catch(e){
        console.log(e)
      }
    }
  }

  let myMeeting =  (element: HTMLDivElement) => {
    let loginUser:any
    let loginToken: any;
    if (typeof window !== "undefined") {
      loginToken = window.localStorage.getItem("loginToken");
      loginUser = window.localStorage.getItem("userData");
    }
    // const user = JSON.parse(loginUser)
    // console.log(user?.first_name,'lllllllllllll')
    if(loginToken){
      import('@zegocloud/zego-uikit-prebuilt')
        .then(module => {
          const ZegoUIKitPrebuilt = module.ZegoUIKitPrebuilt
         
          const appID = 1495782046;
          const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
          const roomID = room;
          const randomID = Date.now().toString();
          const userName = capitalizeFirstLetter(JSON.parse(loginUser).first_name);
          const streamTokenData = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)
          const role = ZegoUIKitPrebuilt.Host

          if (streamTokenData) {
            const zp = ZegoUIKitPrebuilt.create(streamTokenData)
            const createRoomConfig: any = {
              container: element,
              scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                  role,
                },
              },
            }
            zp.joinRoom(createRoomConfig);
            
            localStorage.setItem("liveStreamerRole",'Host')
          }
        })
        .catch(error => {
          console.error(error);
        });
    }else {
      router.push('/login');
    }
  };

  return (
    <>
      <div
        ref={myMeeting}
        style={{ width: '100vw', height: '100vh' }}
      ></div>
    </>
  );
}

export default Live;
