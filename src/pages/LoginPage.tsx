// src/pages/LoginPage.tsx
import React, { useState } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../css/LoginPage.css'

export const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {login, token, logout} = useAuth()
    const navigate = useNavigate()
    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setError(null);
        try {
       
        await login(username, password);
        
        } catch (err: any) {
        setError(err.message || 'Login failed');
        }
        navigate("/")
    };

    return (
        <div id='login_page'>
        <h1>Log In</h1>
        { token ?
            <>
                <div>
                    User Already Logged in
                </div>
                <button onClick={logout}>Log Out!</button>
            </>

            :

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    value={username}
                    autoComplete='true'
                    placeholder='Username'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    autoComplete='true'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log In</button>
                <div>
                    {
                        error && <span>{error}</span>
                    }
                </div>
            </form>
            
        }
        </div>
    );
};