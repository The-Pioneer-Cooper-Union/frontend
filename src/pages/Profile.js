import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './Profile.css';
import Header from "../components/Header";
import { API_URL } from "../util/URL";
import ArticleCard from "../components/ArticleCard";
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../index'

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [editedUserDetails, setEditedUserDetails] = useState({});
    const [userDetails, setUserDetails] = useState(null);
    const [articles, setArticles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchUserDetails();
        }
    }, [currentUser]);

    useEffect(() => {
        if (userDetails && userDetails.username) {
            fetchArticles();
        }
    }, [userDetails]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/user-info/${currentUser.email}`);
            setUserDetails(response.data);
            setEditedUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get(`${API_URL}/article/user/${userDetails.username}`);
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        setEditedUserDetails({ ...editedUserDetails, [e.target.name]: e.target.value });
    };

    const handleUpdateClick = async () => {
        try {
            await axios.put(`${API_URL}/user/update-user/${currentUser.email}`, editedUserDetails);
            setEditMode(false);
            await fetchUserDetails();
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile && selectedFile.type.startsWith('image')) {
            const storageRef = ref(storage, generateFileName(12));
            uploadBytes(storageRef, selectedFile).then((snapshot) => {
                alert('Uploaded an image!');
                getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    alert(`File available at ${downloadURL}`);
                    try {
                        await axios.put(`${API_URL}/user/update-user/${currentUser.email}`, { ...editedUserDetails, ['profilePic']: downloadURL });
                        await fetchUserDetails();
                    } catch (error) {
                        console.error('Error updating user details:', error);
                    }
                });
            });
        } else {
            alert("No file selected (or file is image).");
        }
    };

    const generateFileName = (length) => {
        let result = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    return (
        <div>
            <Header />
            <div className="profile-page">
                <h1>User Profile</h1>
                {userDetails && (
                    <div className="user-details">
                        <div className="user-info">
                            <h2>{editMode ? (
                                <input type="text" value={editedUserDetails.username} onChange={handleInputChange}
                                       name="username"/>
                            ) : userDetails.username}</h2>
                            <p>Email: {userDetails.email}</p>
                            <p>User Type: {editMode ? (
                                <select name="userType" value={editedUserDetails.userType} onChange={handleInputChange}>
                                    <option value="">Select User Type</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="FACULTY">Faculty</option>
                                    <option value="ALUMNI">Alumni</option>
                                </select>
                            ) : userDetails.userType}</p>
                            <p>Major: {editMode ? (
                                <select
                                    name="major"
                                    value={editedUserDetails.major}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Major</option>
                                    <option value="ELECTRICAL ENGINEERING">Electrical Engineering</option>
                                    <option value="MECHANICAL ENGINEERING">Mechanical Engineering</option>
                                    <option value="CHEMICAL ENGINEERING">Chemical Engineering</option>
                                    <option value="CIVIL ENGINEERING">Civil Engineering</option>
                                    <option value="ART">Art</option>
                                    <option value="ARCHITECTURE">Architecture</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            ) : userDetails.major}</p>
                            <p>Graduation Year: {editMode ? (
                                <input type="text" value={editedUserDetails.graduationYear} onChange={handleInputChange}
                                       name="graduationYear"/>
                            ) : userDetails.graduationYear}</p>
                            <p>Short Bio: {editMode ? (
                                <input type="text" value={editedUserDetails.shortBio} onChange={handleInputChange}
                                       name="shortBio"/>
                            ) : userDetails.shortBio}</p>
                            {editMode ? (
                                <button onClick={handleUpdateClick}>Update</button>
                            ) : (
                                <button onClick={handleEditClick}>Edit</button>
                            )}
                        </div>
                    </div>
                )}
                <div>
                    <h1>Change Profile Picture</h1>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div>
                    <h1>User Articles</h1>
                    {articles.length > 0 ? (
                        articles.map(article => (
                            <ArticleCard key={article.articleId} article={article} fetchArticles={fetchArticles}/>
                        ))
                    ) : (
                        <p>No articles found.</p>
                    )}
                </div>
                <button onClick={handleLogout}>Logout</button>
                <p></p>
            </div>
        </div>
    );
};

export default Profile;
