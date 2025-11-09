// src/pages/SignupPage.tsx
import React, { useState } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';

export const SignupPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')

    const {token, logout} = useAuth()
    // 2. Create the form submission handler
    // We use React.SyntheticEvent to get proper TypeScript typing for the event
    const handleSubmit = (event: React.SyntheticEvent) => {
        // A: Prevent the default form browser refresh
        event.preventDefault();

        // B: Log the current state to the console (for testing)
        console.log('Form submitted!');
        console.log({ username, email ,password });
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
            </form>
        }
        </div>
    );
};