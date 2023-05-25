import { LoginHeader } from "@/common/Tokens/authToken"
import { authHeader } from "@/common/Tokens/authToken"
import { API } from "@/config/config"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { HandleLogout } from "./auth"

export const HandleSubscriptionGet = async() =>{ 
   
    const API_URL =`${API.getSubscription}`
    return await axios({
      method: "GET",
      url: API_URL,
      headers: LoginHeader(),
    }).then((request) => {
        return request;
      }).catch((error) => {
        if(error.response.status === 401){
          HandleLogout()
        }else{
          toast.error("Something went wrong")
        }
        return error;
      })
  }

  export const HandleSubscriptionGetByID = async(subId:any) =>{
    return await axios({
      method: "GET",
      url: `${API.getSubsById}/${subId}`,
      headers: LoginHeader(),
    }).then((request) => {
        return request;
      }).catch((error) => {
        if(error.response.status === 401){
          HandleLogout()
        }else{
          toast.error("subscription failed")
        }
        return error;
      })
  }


 