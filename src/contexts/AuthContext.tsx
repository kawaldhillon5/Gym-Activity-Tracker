// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// 1. Define the "shape" of our auth data
interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Create the context
// We use 'as AuthContextType' to "lie" to TypeScript,
// saying we'll definitely provide a value later.
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 3. Create the Provider (the component that "provides" the data)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 4. State to hold the token
  // We'll make this smarter later by checking localStorage
  const [token, setToken] = useState<string | null>(()=> { return localStorage.getItem('accessToken')});

  // 5. The Login Function
  // This is where we'll move our fetch logic
  const login = async (username: string, password: string) => {
    // a. Create FormData
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // b. Call the API
      const response = await fetch("http://127.0.0.1:8000/user/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        
        const result = await response.json()
        // If login fails, throw an error to be caught by the page
        throw new Error(result.detail);
      }

      // c. Get the token from the response
      const data: { access_token: string } = await response.json();

      // d. SET THE TOKEN! This is the key.
      setToken(data.access_token);

      // e. Store the token in localStorage
      // This makes it "persist" even after a page refresh
      localStorage.setItem('accessToken', data.access_token);
      
      console.log('Login successful, token stored!');

    } catch (err) {
      console.error(err);
      // Re-throw the error so the login page can display it
      throw err;
    }
  };

  // 6. The Logout Function
  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    console.log('Logged out, token removed!');
  };

  // 7. The "value" we provide to all children
  const value = {
    token,
    login,
    logout,
  };

  // 8. Return the provider wrapper
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 9. Create a custom "hook" to easily use the context
// This is a "senior dev" trick.
export const useAuth = () => {
  return useContext(AuthContext);
};