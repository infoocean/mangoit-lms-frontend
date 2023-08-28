import React, { useState, useEffect } from 'react';

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}


function Live() {
  let myMeeting = useEffect((element) => {

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
            window.location.pathname +
            '?roomID=' +
            roomID +
            '&role=Audience',
        });

        if (streamTokenData) {
          const zp = ZegoUIKitPrebuilt.create(streamTokenData)
          zp.joinRoom({
            container: element,
            scenario: {
              mode: ZegoUIKitPrebuilt.LiveStreaming,
              config: {
                role,
              },
            },
            sharedLinks,
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);





  return (
    <>
      <div
        ref={myMeeting}
        style={{ width: '100vw', height: '100vh' }}
      ></div>
      {/* {ZegoUIKitPrebuilt ? (

        <div
          ref={myMeeting}
          style={{ width: '100vw', height: '100vh' }}
        ></div>
      ) : (
        <div>Loading...</div>
      )} */}
    </>
  );
}

export default Live;







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



// import React, { useState, useEffect } from 'react';

// export function getUrlParams(
//   url: string = window.location.href
// ): URLSearchParams {
//   let urlStr = url.split('?')[1];
//   return new URLSearchParams(urlStr);
// }


// function Live() {

//   let myMeeting = useEffect((element) => {
//     // Dynamic import using a Promise
//     import('@zegocloud/zego-uikit-prebuilt')
//       .then(module => {

//         const ZegoUIKitPrebuiltData = module.ZegoUIKitPrebuilt
//         const appID = 1495782046;
//         const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
//         const roomID = 'ABC123';
//         const randomID = Date.now().toString();
//         const userName = 'Test1'
//         const streamTokenData = ZegoUIKitPrebuiltData.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)


//         let role_str = getUrlParams(window.location.href).get('role') || 'Host';
//         const role =
//           role_str === 'Host'
//             ? ZegoUIKitPrebuilt.Host
//             : role_str === 'Cohost'
//               ? ZegoUIKitPrebuilt.Cohost
//               : ZegoUIKitPrebuilt.Audience;

//         let sharedLinks = [];
//         if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
//           sharedLinks.push({
//             name: 'Join as co-host',
//             url:
//               window.location.origin +
//               window.location.pathname +
//               '?roomID=' +
//               roomID +
//               '&role=Cohost',
//           });
//         }
//         sharedLinks.push({
//           name: 'Join as audience',
//           url:
//             window.location.origin +
//             window.location.pathname +
//             '?roomID=' +
//             roomID +
//             '&role=Audience',
//         });

//         if (streamTokenData) {
//           const zp = ZegoUIKitPrebuiltData.create(streamTokenData)
//           zp.joinRoom({
//             container: element,
//             scenario: {
//               mode: ZegoUIKitPrebuiltData.LiveStreaming,
//               config: {
//                 role,
//               },
//             },
//             sharedLinks,



//           })
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);





//   return (
//     <>
//       <div
//         ref={myMeeting}
//         style={{ width: '100vw', height: '100vh' }}
//       ></div>
//       {/* {ZegoUIKitPrebuilt ? (

//         <div
//           ref={myMeeting}
//           style={{ width: '100vw', height: '100vh' }}
//         ></div>
//       ) : (
//         <div>Loading...</div>
//       )} */}
//     </>
//   );
// }

// export default Live;




// import React, { useEffect } from 'react'

// const live = () => {

//     useEffect(() => {
//         var ZegoExpressEngine = require('zego-express-engine-webrtc').ZegoExpressEngine;

//         const appID = 1495782046;
//         const server = `wss://webliveroom1495782046-api.coolzcloud.com/ws`;
//         const serverSecret = 'dd03bddcb9341b6339960764c75ae393';
//         const randomID = Date.now().toString();
//         const roomID = 'ABC123';
//         const userID = "TestUser";
//         const userName = 'Test1';
//         const token = '+/HYJN2c0WmMxqOxkmZdJ3dWL3xqy0SSWD0i9HGqqTUTYMBbsHTZCnlDFgB0JfUgM0eNQJc4KB6+KfWW0QJEMxSrvnvM=#eyJ1c2VySUQiOiIxNjkyOTUxMTI2MDQ1Iiwicm9vbUlEIjoiNDE0NiIsInVzZXJOYW1lIjoiVGVzdDEiLCJhcHBJRCI6MTQ5NTc4MjA0Nn0='
//         const zg = new ZegoExpressEngine(appID, server);
//         const getCallbacks = async () => {
//             // const checkSystemRequirement = await zg.checkSystemRequirements()         
//             // const token = zg.generateKitTokenForTest(appID, serverSecret, roomID, randomID, userName)
//             const loginToRoom = await zg.loginRoom(roomID,token,{userID,userName},{userUpdate:true})
//             console.log('rrrrrrrrrrrrrrrrrr', loginToRoom)
//         }
//         getCallbacks()

//     }, []);


//     return (
//         <div>live streaming</div>
//     )
// }

// export default live;

//...................................................................................
// // get token
// function generateToken(tokenServerUrl, userID) {
//   // Obtain the token interface provided by the App Server
//   return fetch(
//     `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
//     {
//       method: 'GET',
//     }
//   ).then((res) => res.json());
// }

// function randomID(len) {
//   let result = '';
//   if (result) return result;
//   var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
//     maxPos = chars.length,
//     i;
//   len = len || 5;
//   for (i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return result;
// }

// export function getUrlParams(
//   url: string = window.location.href
// ): URLSearchParams {
//   let urlStr = url.split('?')[1];
//   return new URLSearchParams(urlStr);
// }

// export default function App() {
//   const roomID = getUrlParams().get('roomID') || randomID(5);
//   const userID = randomID(5);
//   const userName = randomID(5);
//   let role_str = getUrlParams(window.location.href).get('role') || 'Host';
//   const role =
//     role_str === 'Host'
//       ? ZegoUIKitPrebuilt.Host
//       : role_str === 'Cohost'
//       ? ZegoUIKitPrebuilt.Cohost
//       : ZegoUIKitPrebuilt.Audience;

//   let sharedLinks = [];
//   if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
//     sharedLinks.push({
//       name: 'Join as co-host',
//       url:
//         window.location.origin +
//         window.location.pathname +
//         '?roomID=' +
//         roomID +
//         '&role=Cohost',
//     });
//   }
//   sharedLinks.push({
//     name: 'Join as audience',
//     url:
//       window.location.origin +
//       window.location.pathname +
//       '?roomID=' +
//       roomID +
//       '&role=Audience',
//   });
//   let myMeeting = async (element: HTMLDivElement) => {
//     // generate token
//     generateToken(
//       'https://nextjs-token-7berndqqr-choui666.vercel.app/api',
//       userID
//     ).then((res) => {
//       const token = ZegoUIKitPrebuilt.generateKitTokenForProduction(
//         1484647939,
//         res.token,
//         roomID,
//         userID,
//         userName
//       );
//       // create instance object from token
//       const zp = ZegoUIKitPrebuilt.create(token);
//       // start the call
//       zp.joinRoom({
//         container: element,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.LiveStreaming,
//           config: {
//             role,
//           },
//         },
//         sharedLinks,
//       });
//     });
//   };

//   return (
//     <div
//       className="myCallContainer"
//       ref={myMeeting}
//       style={{ width: '100vw', height: '100vh' }}
//     ></div>
//   );
// }
