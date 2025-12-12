// src/pages/SignupPage.tsx
import React, { useMemo, useState, type ChangeEvent, type FocusEvent } from 'react'; // Import useState 
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { InputGroup } from '../components/InputGroup';
import { CheckCircle, Lock, Mail, User } from 'lucide-react';
import "../css/SignupPage.css"

const url = import.meta.env.VITE_API_URL

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface TouchedState {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

type SignupStatus = 'idle' | 'Loading' | 'success';

interface PasswordValidation {
    isValid: boolean;
    error: string ;
}

interface ValidationResult {
  name: boolean;
  email: boolean;
  password: PasswordValidation;
  match: boolean;
  count: number;
  allValid: boolean;
}

export const SignupPage = () => {
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [touched, setTouched] = useState<TouchedState>({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const [status, setStatus] = useState<SignupStatus>('idle');

    
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const {token, logout} = useAuth()

    const validatePassword = (password: string)=>{

        const passwordValid : PasswordValidation= { 
            isValid : false,
            error : ""
        }

        if (password.length < 8) {
            passwordValid.error = "Password must be at least 8 characters long.";
            return passwordValid
        }
        if (!/[a-z]/.test(password)) {
            passwordValid.error = "Password must contain at least one lowercase letter.";
            return passwordValid
        }
        if (!/[A-Z]/.test(password)) {
            passwordValid.error = "Password must contain at least one uppercase letter.";
            return passwordValid
        }
        if (!/[0-9]/.test(password)) {
            passwordValid.error = "Password must contain at least one number.";
            return passwordValid
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            passwordValid.error =  "Password must contain at least one special character.";
            return passwordValid
        }
        passwordValid.isValid = true;
        return passwordValid
         
    };

    const validation = useMemo<ValidationResult>(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        const nameValid = formData.name.length >= 3;
        const emailValid = emailRegex.test(formData.email);
        const passValid = validatePassword(formData.password);
        const matchValid = formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password;

        return {
        name: nameValid,
        email: emailValid,
        password: passValid,
        match: matchValid,
        count: [nameValid, emailValid, passValid.isValid, matchValid].filter(Boolean).length,
        allValid: nameValid && emailValid && passValid.isValid && matchValid
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
        setError(null)
        if( ! validation.allValid){
            throw new Error("Please Check All fileds")
        }
        try {
            setStatus("Loading")
            const response = await fetch(`${url}/user/`, {
                method: "POST",
                body: JSON.stringify({
                    user_name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword :  formData.confirmPassword
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if(!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || "Sign Up Failed")
            }
            setStatus("success")
            console.log("Sign Up sucessfull")
            navigate("/login");
        } catch (err : any) {
            console.error(err);
            setError(err.message);
            setStatus("idle")
        }
    };

    return (
        <div className='signup_main_div'>
        { token ?
            <>
                <div>User Already Logged in</div>
                <button onClick={logout}>Log Out!</button>
            </>

            :
            <div className="signup_form_div">
                <div className="signup_header_div">
                    <div className="signup_header">
                        <div className="header_logo">C</div>
                        <span className="signup_header_text">Caliber</span>
                    </div>
                    <p className="sign_up_secondary_text">Sign Up to Start Your Journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <InputGroup 
                icon={<User size={20} />}
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validation.name}
                isTouched={touched.name}
                errorMsg="Name must be at least 3 characters"
                />

                {/* Email Input */}
                <InputGroup 
                icon={<Mail size={20} />}
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validation.email}
                isTouched={touched.email}
                errorMsg="Please enter a valid email"
                />

                {/* Password Input */}
                <InputGroup 
                icon={<Lock size={20} />}
                type="password" 
                name="password" 
                placeholder="Password (Min 8 chars)" 
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validation.password.isValid}
                isTouched={touched.password}
                errorMsg={validation.password.error}
                />

                {/* Confirm Password Input */}
                <InputGroup 
                icon={<CheckCircle size={20} />}
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={validation.match}
                isTouched={touched.confirmPassword}
                errorMsg="Passwords do not match"
                />

                <button
                    disabled={!validation.allValid || status !== 'idle'}
                    className="btn-primary"
                    style={{ marginTop: '32px', opacity: validation.allValid ? 1 : 0.5 }}
                >
                    {status === 'idle' && "Create Account"}
                    {status === 'Loading' && "Creating Account..."}
                    {status === 'success' && "Success"}
                </button>
                
                {error && (
                    <div className='error-text' style={{ color: 'var(--error)', marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}
                </form>
                <div className="signup_login_link_div">
                    Already a member? <Link to={'/login'} >Log In</Link>
                </div>
            </div>
        }
        </div>
    );
};