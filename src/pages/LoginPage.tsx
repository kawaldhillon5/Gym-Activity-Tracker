// src/pages/LoginPage.tsx
import React, { useEffect, useMemo, useState, type ChangeEvent, type FocusEvent } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import '../css/LoginPage.css'
import '../components/InputGroup'
import { InputGroup } from '../components/InputGroup';
import { Lock, User } from 'lucide-react';
import { LineWobble } from 'ldrs/react';
import 'ldrs/react/LineWobble.css'
import { AnimatedCheckmark } from '../components/AnimatedCheckMark';

interface FormData {
    username: string;
    password: string;
}

interface TouchedState {
    username: boolean;
    password: boolean;
}

interface ValidationResult {
    username: boolean;
    password: boolean;
    allValid: boolean;
}

type SignupStatus = 'idle' | 'Loading' | 'success';


export const LoginPage = () => {

    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    });

    const [touched, setTouched] = useState<TouchedState>({
        username: false,
        password: false,
        
    });

    const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false)

    
    const [status, setStatus] = useState<SignupStatus>('idle');
    
    const [error, setError] = useState<string | null>(null);
    const {login, token, logout} = useAuth()
    const navigate = useNavigate()

    const validation = useMemo<ValidationResult>(() => {
        
        const nameValid = formData.username.length >= 3;
        const passValid = formData.password.length >= 8;

        return {
            username: nameValid,
            password: passValid,
            allValid: nameValid  && passValid
        };
    }, [formData]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name as keyof TouchedState]: true }));
    };    

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setError(null);
        if( ! validation.allValid){
            throw new Error("Please Check All fileds")
        }
        try {
            setStatus("Loading")
            await login(formData.username, formData.password);
            setStatus("success")

        } catch (err: any) {
            setStatus("idle")
            setError(err.message || 'Login failed');
        }
    };

    useEffect(()=>{
       if (status == "success"){
        setTimeout(()=>{
            navigate('/home')
        },700)
       } 
    },[status])

    return (
        <div className='login_main_div'>
        { token && status == "idle" ?
            <>
                <div>
                    User Already Logged in
                </div>
                <button onClick={logout}>Log Out!</button>
            </>

            :
            <div className='login_form_div'>
                <div className="login_header_div">
                    <div className="login_header">
                        <div className="header_logo">C</div>
                        <span className="login_header_text">Caliber</span>
                    </div>
                    <p className="login_secondary_text">Log In to View Your Jouney So far</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputGroup 
                        icon={<User size={20} />}
                        type="text" 
                        name="username" 
                        placeholder="User Name" 
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={validation.username}
                        isTouched={touched.username}
                        errorMsg="Userame must be at least 3 characters"
                    />
                    <InputGroup 
                        icon={<Lock size={20} />}
                        type={isPasswordFocused ? "text" : "password"} 
                        name="password" 
                        placeholder="Password (Min 8 chars)" 
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={()=>{setIsPasswordFocused(true)}}
                        onBlur={(e) =>{
                            setIsPasswordFocused(false) 
                            handleBlur(e)}}
                        isValid={validation.password}
                        isTouched={touched.password}
                        errorMsg="Password must be at least 8 characters"
                    />
                    <button
                        disabled={!validation.allValid || status !== 'idle'}
                        className="btn-primary"
                        id={status === "success" ? 'btn_success': ""}
                        style={{ marginTop: '32px', opacity: validation.allValid ? 1 : 0.5, boxShadow : validation.allValid ? "0 0 20px white" : "0 0 5px white"}}
                    >
                        {status === 'idle' && "Log In"}
                        {status === 'Loading' && <LineWobble size="120" stroke="10" bgOpacity='0.1' color='black' />}
                        {status === 'success' && <AnimatedCheckmark height={58.5} width={60} />}
                    </button>
                    
                    {error && (
                        <div className='error-text' style={{ color: 'var(--error)', marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                </form>
                <div className="login_signup_link_div">
                    Not a member Yet ? <Link to={'/signup'} >Sign Up</Link>
                </div>
            </div>
            
        }
        </div>
    );
};