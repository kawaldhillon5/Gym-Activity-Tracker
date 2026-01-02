import React, { createContext, useContext, useState } from "react";

interface ErrorContextType {
    error:string| null;
    setError: (val:string | null) =>void;
}

const ErrorContext = createContext<ErrorContextType>({} as ErrorContextType);

export const ErrorProvider = ({ children }: { children: React.ReactNode })=>{

    const [error, setError] = useState<string | null>(null);

    const value = {
        error,
        setError,
    };

    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

export const useError = ()=>{
    return useContext(ErrorContext)
}