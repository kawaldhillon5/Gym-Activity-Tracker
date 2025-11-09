// src/pages/LoginPage.tsx
import React, { useState } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {login, token, logout} = useAuth()

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setError(null);
        try {
       
        await login(username, password);
        
        } catch (err: any) {
        setError(err.message || 'Login failed');
        }
    };

    return (
        <div>
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
                <div>
                <label htmlFor="username">Username:</label>
                {/* 4. Wire up the input's value and onChange handler */}
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
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