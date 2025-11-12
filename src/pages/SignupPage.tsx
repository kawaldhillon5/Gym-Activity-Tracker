// src/pages/SignupPage.tsx
import React, { useState } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_API_URL

export const SignupPage = () => {
    console.log(url)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const {token, logout} = useAuth()

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setError(null)
        try {
            const response = await fetch(`${url}/user/`, {
                method: "POST",
                body: JSON.stringify({
                    user_name: username,
                    email: email,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if(!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || "Sign Up Failed")
            }
            console.log("Sign Up sucessfull")
            navigate("/login");
        } catch (err : any) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div>
        <h1>Sign Up</h1>
        { token ?
            <>
                <div>User Already Logged in</div>
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
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Sign Up</button>
                <div>
                    <span>{error}</span>
                </div>
            </form>
        }
        </div>
    );
};