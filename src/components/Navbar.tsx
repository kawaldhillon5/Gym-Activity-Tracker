import { useAuth, type User } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css'
import { useEffect, useRef, useState, type MouseEventHandler, type RefObject } from "react";
import { AnimatedCheckmark } from "./AnimatedCheckMark";
import { User2, X } from "lucide-react";
import { useOnClickOutside } from "../contexts/OnClickOutside";

type LogOutStatus = 'idle' | 'success';


export const Navbar = () =>{

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isToucehd , setIsTouched] = useState<boolean>(false)
    const [isExpanded , setIsExpanded] = useState<boolean>(false)
    const [LogOutStatus, setLogOutStatus] = useState<LogOutStatus>("idle")

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRef, () => {
            setIsExpanded(false)
            setIsTouched(false)
        }
    );



    const handleLogout = () =>{
        setLogOutStatus("success")
        setTimeout(()=>{
            setIsExpanded(false)
            setIsTouched(false)
        }, 500)
        setTimeout(()=>{
            logout()
            navigate('/login')
            setLogOutStatus("idle")
        },1000)

    }

    const handleTouched = () =>{
        setIsTouched((prev) => !prev)
        setIsExpanded((prev) => !prev)
    }

    if (user == null){
        return null
    }

    return (
        <nav>
            
            <Link className="home_link" to={'/home'}>Home</Link>
            <div
                onClick={handleTouched} 
                className={`user_link ${isToucehd ? "user_link_expanded":""}`}>
                {isToucehd ? <X />:<User2 />}
            </div>
            <UserLink dropdownRef={dropdownRef} user={user} logOutstatus={LogOutStatus}  isExpanded = {isExpanded} handleLogout={handleLogout}/>

                           
        </nav>
    )
}

const UserLink = function({user, handleLogout, logOutstatus, isExpanded, dropdownRef}:{user: User, handleLogout: MouseEventHandler, logOutstatus: LogOutStatus, isExpanded: boolean, dropdownRef: RefObject<HTMLDivElement | null>}){
    
    const [userNameVisible, setUserNameVisible] = useState<boolean>(false)
    const [logoutBtnVisible, setLogoutBtnVisible] = useState<boolean>(false)

    useEffect(()=>{
        if(isExpanded){
            setTimeout(()=>{
                setUserNameVisible(true)
            },100)
            setTimeout(()=>{
                setLogoutBtnVisible(true)
            },200)            
        } else {
            setTimeout(()=>{
                setLogoutBtnVisible(false)
            },100)
            setTimeout(()=>{
                setUserNameVisible(false)
            },200)         
        }
    },[isExpanded])

    
    return (
        <div 
            ref={dropdownRef}
            className={`user_link_div ${isExpanded ? "user_link_div_expanded":""}`}
            style={{height: isExpanded ? "500%" : "0%", padding: isExpanded ? "60px 15px 15px 15px": "0px", border: isExpanded ? "1px solid var(--border-subtle)" : "0px" , width: isExpanded ? "40vw": "10vw"}}
            >
            <span 
                className="user_drop_down_name"
                style={{opacity: userNameVisible ? 1 : 0}}
                ><User2/>{user.user_name}
            </span>
            <button
                className=" user_drop_down_btn"
                id={logOutstatus === "success" ? 'btn_success': ""}
                style={{ marginTop: '10px', opacity: logoutBtnVisible ? 1 : 0, boxShadow : "0 0 20px white" }}
                onClick={handleLogout}>
                    {logOutstatus === 'idle' && "Log Out"}
                    {logOutstatus === 'success' && <AnimatedCheckmark height={40} width={40} />}
            </button>
        </div>
    )
}