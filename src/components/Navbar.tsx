import { useAuth, type User } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css'
import { useRef, useState, type MouseEventHandler } from "react";
import { AnimatedCheckmark } from "./AnimatedCheckMark";
import { HomeIcon, User2 } from "lucide-react";
import { useOnClickOutside } from "../contexts/OnClickOutside";
import MorphUser from "./MorphyingUserIcon";
import { useError } from "../contexts/ErrorContext";

type LogOutStatus = 'idle' | 'success';


export const Navbar = () =>{

    const { user, logout } = useAuth();
    const {error} = useError();

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [LogOutStatus, setLogOutStatus] = useState<LogOutStatus>("idle")

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRef, () => {
            setIsOpen(false)
        }
    );



    const handleLogout = () =>{
        setLogOutStatus("success")
        setTimeout(()=>{
            setIsOpen(false)
        }, 500)
        setTimeout(()=>{
            logout()
            navigate('/login')
            setLogOutStatus("idle")
        },1000)

    }



    if (user == null){
        return null
    }

    return (
        <nav ref={dropdownRef}>
            
            <Link className="home_link" to={'/home'}><HomeIcon /></Link>
            {error && error.length > 0 && <div className="nav-error-div" style={{ color: 'var(--error)', marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
            <div
                onClick={() => setIsOpen(prev => !prev)} 
                className={`user_link ${isOpen ? "user_link_expanded":""}`}>
                <MorphUser isUser={!isOpen} />
            </div>
            <UserLink user={user} logOutstatus={LogOutStatus}  isExpanded = {isOpen} handleLogout={handleLogout}/>

                           
        </nav>
    )
}

const UserLink = function({user, handleLogout, logOutstatus, isExpanded}:{user: User, handleLogout: MouseEventHandler, logOutstatus: LogOutStatus, isExpanded: boolean}){
    
    
    return (
        <div 
            className={`user_link_div ${isExpanded ? "user_link_div_expanded":""}`}
            style={{ padding: isExpanded ? "60px 15px 15px 15px": "0px", border: isExpanded ? "1px solid var(--border-subtle)" : "0px" , width: isExpanded ? "200px": "50px"}}
            >
            <span 
                className="user_drop_down_name"
                ><User2/>{user.user_name}
            </span>
            <button
                className="btn-primary user_drop_down_btn"
                id={logOutstatus === "success" ? 'btn_success': ""}
                style={{ marginTop: '10px', boxShadow : "0 0 20px white" }}
                onClick={handleLogout}>
                    {logOutstatus === 'idle' && "Log Out"}
                    {logOutstatus === 'success' && <AnimatedCheckmark height={60} width={60} />}
            </button>
        </div>
    )
}