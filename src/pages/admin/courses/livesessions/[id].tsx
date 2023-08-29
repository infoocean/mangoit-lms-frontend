import { useRouter } from 'next/router';
import React from 'react';

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

function Live() {
  const router = useRouter();
  // let loginToken;
  // if (typeof window !== "undefined") {
  //   loginToken = window.localStorage.getItem("loginToken")
  // }

  // if (loginToken && router?.query?.role === "Audience") {
  //   const url = `/user/course/liveusersession/${router?.query?.id}/?roomID=${router?.query?.roomID}&role=Audience`;
  //   router.push(url)
  // } else if (loginToken && router?.query?.role === "Cohost") {
  //   const url = `/admin/courses/livesessions/${router?.query?.id}/?roomID=${router?.query?.roomID}&role=Cohost`;
  //   router.push(url)
  // }


  const { id } = router?.query;
  let myMeeting =  (element: HTMLDivElement) => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    console.log('uuuuuuuu',localData)
    import('@zegocloud/zego-uikit-prebuilt')
      .then(module => {
        const ZegoUIKitPrebuilt = module.ZegoUIKitPrebuilt
        const appID = 1495782046;
        const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
        const roomID = 'ABC123';
        const randomID = Date.now().toString();
        const userName = 'User';
        const streamTokenData = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)
        let role_str = getUrlParams(window.location.href).get('role') || 'Host';
        const role =
          role_str === 'Host'
            ? ZegoUIKitPrebuilt.Host
            : role_str === 'Cohost'
              ? ZegoUIKitPrebuilt.Cohost
              : ZegoUIKitPrebuilt.Audience;
        const userUrlcreated = `/user/course/liveusersession/${id}`
        let sharedLinks = [];
        if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
          sharedLinks.push({
            name: 'Join as co-host',
            url:
              window.location.origin +
              window.location.pathname +
              '?roomID=' +
              roomID +
              '&role=Cohost',
          });
        }
        sharedLinks.push({
          name: 'Join as audience',
          url:
            window.location.origin +
            userUrlcreated +
            '?roomID=' +
            roomID +
            '&role=Audience',
        });
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
            sharedLinks,
          }
          zp.joinRoom(createRoomConfig);
          localStorage.setItem("liveStreamerRole",'Host')
        }
      })
      .catch(error => {
        console.error(error);
      });
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







