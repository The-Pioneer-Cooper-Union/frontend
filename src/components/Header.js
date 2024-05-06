import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../AuthContext';
import axios from "axios";
import {API_URL} from "../util/URL";

const Header = () => {
    const { currentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchUserDetails();
        }
    }, [currentUser]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/user-info/${currentUser.email}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-nav-container">
                <Link to="/home" className="header-logo-link">The Pioneer</Link>

                {currentUser && userDetails && (
                    <div className="header-user-actions">
                        <Link to="/home/profile" className="header-user-info">
                            <img src={`${userDetails.profilePic}?v=${Date.now()}`} alt="User" className="header-user-pic"/>
                            <span>{userDetails.username}</span>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
