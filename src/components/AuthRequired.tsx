import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"


export const AuthRequired = () =>{
    const {token} = useAuth()
    if (token) 
        return <Outlet /> 
    else  
        return < Navigate to={"/login"} replace />
}