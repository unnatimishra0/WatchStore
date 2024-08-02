import { API_URL } from "../../components/config/api"
import { GET_USER_REQUEST, LOGIN_REQUEST, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType"

export const registerUser=(reqData)=>async(dispatch)=>{
    dispatch({type:REGISTER_REQUEST})

    try{
        const{data} =await axios.post(`${API_URL}/auth/signup`,reqData.userata)
        if(data.jwt)localStorage.setItem("jwt",data.jwt);
        if(data.role==="ROLE_ADMIN"){
            reqData.navigate("/admin")

        } 
        else{
            reqData.navigate("/")
        }
        dispatch({type:REGISTER_SUCCESS,payload:data.jwt})
        console.log("register success",data)

    }catch{
        console.log("error")
    }

}

export const loginUser=(reqData)=>async(dispatch)=>{
    dispatch({type:LOGIN_REQUEST})

    try{
        const{data} =await axios.post(`${API_URL}/auth/signin`,reqData.userata)
        if(data.jwt)localStorage.setItem("jwt",data.jwt);
        if(data.role==="ROLE_ADMIN"){
            reqData.navigate("/admin")

        } 
        else{
            reqData.navigate("/")
        }
        dispatch({type:REGISTER_SUCCESS,payload:data.jwt})
        console.log("login success",data)

    }catch{
        console.log("error")
    }

}

export const getUser=(reqData)=>async(dispatch)=>{
    dispatch({type:GET_USER_REQUEST})

    try{
        const{data} =await api.post(`auth/signup`,{
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        })
        
        dispatch({type:REGISTER_SUCCESS,payload:data.jwt})
        console.log("user profile",data)
    }catch{
        console.log("error")
    }

}