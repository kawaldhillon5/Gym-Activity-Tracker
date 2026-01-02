import React, { createContext, useContext, useState, useEffect } from 'react';

const url = import.meta.env.VITE_API_URL


export interface User {
  id: number;
  user_name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null; 
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// 3. Create the context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 4. Create the Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 5. "Hydrate" the token from localStorage on initial load
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  // 6. NEW: State to hold the user object
  const [user, setUser] = useState<User | null>(null);

  // 7. NEW: The "re-validation" effect
  // This runs ONCE on app load. Its job is to use the
  // token from localStorage to fetch the user's data.
  useEffect(() => {
    // We only run this if we have a token but no user data
    if (token && !user) {
      fetch(`${url}/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          // If the token is expired or invalid, the API will send a 401
          // In that case, we throw an error to be caught below
          throw new Error('Token is invalid');
        })
        .then(data => {
          // Success! We got the user data back
          setUser(data);
        })
        .catch(() => {
          // If the fetch failed (e.g., bad token), we log the user out
          // to clear the bad state.
          console.error("Auto-login failed, clearing token");
          logout();
        });
    }
  }, [token]); // This effect re-runs if the token changes

  // 8. The Login Function (now with user fetching!)
  const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // Step 1: Get the token
      const tokenResponse = await fetch(`${url}/user/login`, {
        method: "POST",
        body: formData,
      });

      if (!tokenResponse.ok) {
        const result = await tokenResponse.json();
        throw new Error(result.detail || 'Login failed');
      }

      const tokenData: { access_token: string } = await tokenResponse.json();
      const newToken = tokenData.access_token;

      // Step 2: Store the token and set it in state
      localStorage.setItem('accessToken', newToken);
      setToken(newToken); // This will trigger the useEffect above, but we can be faster

      // Step 3: Use the new token to get the user data
      const userResponse = await fetch(`${url}/user/me`, {
        headers: {
          'Authorization': `Bearer ${newToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data after login.');
      }

      const userData = await userResponse.json();
      
      // Step 4: Set the user in state
      setUser(userData);
      console.log('Login successful, token and user stored!');

    } catch (err) {
      console.error(err);
      // Clear any bad state if login fails
      setToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      throw err; 
    }
  };

  // 9. The Logout Function 
  const logout = () => {
    setToken(null);
    setUser(null); 
    localStorage.removeItem('accessToken');
    console.log('Logged out, token and user removed!');
  };

  // 10. The "value" we provide
  const value = {
    token,
    user, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 11. The custom "hook"
export const useAuth = () => {
  return useContext(AuthContext);
};