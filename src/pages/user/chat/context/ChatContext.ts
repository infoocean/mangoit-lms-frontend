// import {
//     createContext,
//     useContext,
//     useReducer,
//   } from "react";
//   import { AuthContext } from "../index";
  
//   export const ChatContext = createContext('');
  
//   export const ChatContextProvider = () => {
//     const { currentUser }:any = useContext(AuthContext);
//     const INITIAL_STATE = {
//       chatId: "null",
//       user: {},
//     };
  
//     const chatReducer = (state:any, action:any) => {
//       switch (action.type) {
//         case "CHANGE_USER":
//           return {
//             user: action.payload,
//             chatId:
//               currentUser.uid > action.payload.uid
//                 ? currentUser.uid + action.payload.uid
//                 : action.payload.uid + currentUser.uid,
//           };
  
//         default:
//           return state;
//       }
//     };
  
//      const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   };
  