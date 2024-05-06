import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const auth = getAuth();

    const logIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            navigate('/home');
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="login-page">
            <div className="left-side">
                <Link to="/" className="logo-link">
                    <h1 className="logo-text">The Pioneer</h1>
                </Link>
            </div>
            <div className="login-right-side">
                <h1>Log In</h1>
                {error && <p className="login-error">{error}</p>}
                <input
                    className="login-input"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={logIn}>Log In</button>
                <Link className="login-link" to="/signUp">Don't have an account? Create one here</Link>
            </div>
        </div>
    );
};

export default Login;
