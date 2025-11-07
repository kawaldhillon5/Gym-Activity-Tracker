// src/pages/LoginPage.tsx
import React, { useState } from 'react'; // Import useState 

export const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // 2. Create the form submission handler
    // We use React.SyntheticEvent to get proper TypeScript typing for the event
    const handleSubmit = (event: React.SyntheticEvent) => {
        // A: Prevent the default form browser refresh
        event.preventDefault();

        // B: Log the current state to the console (for testing)
        console.log('Form submitted!');
        console.log({ username ,password });
    };

    return (
        <div>
        <h1>Log In</h1>
        
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
        </form>
        </div>
    );
};