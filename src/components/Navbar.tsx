import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () =>{
    const { token,user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout()
        navigate('/login')
    }

    return (
        <nav>
            <Link to={'/'}>Home</Link>
            {
                token && user ?
                    <>
                        <span>{user.user_name}</span>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                    :
                    <>
                        <Link to={"/login"}>Log In</Link> 
                        <Link to={"/signup"}>Sign Up</Link>
                    </>                    
            }
        </nav>
    )
}