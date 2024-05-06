import React from 'react';
import { Link } from 'react-router-dom';
import './Start.css';

function Start() {
    return (
        <div className="start-container">
            <div className="start-left-side">
                <h1 style={{color: 'black'}}>The Pioneer</h1>
            </div>
            <div className="start-right-side">
                <div className="start-buttons-container">
                    <Link to="/login" className="start-button">Log In</Link>
                    <Link to="/signUp" className="start-button">Create Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Start;
