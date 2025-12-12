import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import '../css/Navbar.css'

export const Navbar = () =>{
    const { token,user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout()
        navigate('/login')
    }

    if (user == null){
        return null
    }

    return (
        <nav>
            <Link className="home_link" to={'/'}>Home</Link>
            {
                token && user ?
                    <div className="auth_links">
                        <span>{user.user_name}</span>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                    :
                    <div className="auth_links">
                        <Link to={"/login"}>Log In</Link> 
                        <Link to={"/signup"}>Sign Up</Link>
                    </div>                    
            }
        </nav>
    )
}