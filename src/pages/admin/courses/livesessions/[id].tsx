import React, { useState, useEffect } from 'react';

function LiveSteram() {
  const [ZegoUIKitPrebuilt, setZegoUIKitPrebuilt] = useState<any>(null);

  let myMeeting = useEffect((element) => {
    // Dynamic import using a Promise
    import('@zegocloud/zego-uikit-prebuilt')
      .then(module => {
        // console.log(module.ZegoUIKitPrebuilt)
        function getUrlParams(url: string) {
          let urlStr = url.split('?')[1];
          const urlSearchParams = new URLSearchParams(urlStr);
          const result = Object.fromEntries(urlSearchParams.entries());
          return result;
        }
        const roomID = getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");
        console.log('rrrrrrrrrrrrr',roomID)
        setZegoUIKitPrebuilt(module.ZegoUIKitPrebuilt);
        const ZegoUIKitPrebuiltData = module.ZegoUIKitPrebuilt
        const appID = 1495782046;
        const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
        // const roomID = 'ABC123';
        const randomID = Date.now().toString();
        const userName = 'Test1'
        const streamTokenData = ZegoUIKitPrebuiltData.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)

        if (streamTokenData) {
          const zp = ZegoUIKitPrebuiltData.create(streamTokenData)
          zp.joinRoom({
            container: element,
            scenario: {
              mode: ZegoUIKitPrebuiltData.VideoConference
            }
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [ZegoUIKitPrebuilt]);





  return (
    <>
      {ZegoUIKitPrebuilt ? (

        <div
          ref={myMeeting}
          style={{ width: '100vw', height: '100vh' }}
        ></div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default LiveSteram;







// export default function App() {
//   const roomID = getUrlParams().get('roomID') || randomID(5);
//   let myMeeting = async (element) => {

//  // generate Kit Token
//  const appID = ;
//  const serverSecret = "";
//  const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  randomID(5),  randomID(5));

//  // Create instance object from Kit Token.
//  const zp = ZegoUIKitPrebuilt.create(kitToken);
//  // start the call
//  zp.joinRoom({
//         container: element,
//         sharedLinks: [
//           {
//             name: 'Personal link',
//             url:
//              window.location.protocol + '//' + 
//              window.location.host + window.location.pathname +
//               '?roomID=' +
//               roomID,
//           },
//         ],
//         scenario: {
//          mode: ZegoUIKitPrebuilt.VideoConference,
//         },
//    });
//   };

//   return (
//     <div
//       className="myCallContainer"
//       ref={myMeeting}
//       style={{ width: '100vw', height: '100vh' }}
//     ></div>
//   );
// }