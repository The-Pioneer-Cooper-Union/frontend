import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './SignUp.css';
import {API_URL} from '../util/URL.js';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    passwordHash: '',
    userType: '',
    major: '',
    graduationYear: '',
    profilePic: 'https://firebasestorage.googleapis.com/v0/b/the-pioneer-43ce8.appspot.com/o/IMG_2984.jpg?alt=media&token=d77ba77f-7fa4-4336-589f57c45fe2', // Change to default in blob storage later
    shortBio: '',
  });
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const { email, passwordHash, username, userType, major, graduationYear, profilePic, shortBio } = newUser;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, passwordHash);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
        photoURL: profilePic
      });


      const userDetails = {
        username,
        email,
        passwordHash,
        userType,
        major,
        graduationYear,
        profilePic,
        shortBio,

      };

      await axios.post(`${API_URL}/user/create-user`, userDetails);
      alert('User created successfully!');

      navigate('/home');
      setNewUser({
        username: '',
        email: '',
        passwordHash: '',
        userType: '',
        major: '',
        graduationYear: '',
        profilePic: '',
        shortBio: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user: ' + (error.response?.data || error.message));
    }
  };
  return (

      <div className="signup-page">
        <div className="left-side">
          <Link to="/" className="logo-link">
            <h1 className="logo-text">The Pioneer</h1>
          </Link>
        </div>
        <div className="right-side">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                placeholder="Username"
            />
            <input
                name="email"
                value={newUser.email}
                type={"email"}
                onChange={handleInputChange}
                placeholder="Email"
            />
            <input
                name="passwordHash"
                value={newUser.passwordHash}
                type={"password"}
                onChange={handleInputChange}
                placeholder="Password"
            />
            <select
                name="userType"
                value={newUser.userType}
                onChange={handleInputChange}
            >
              <option value="">Select User Type</option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ALUMNI">Alumni</option>
            </select>
            <select
                name="major"
                value={newUser.major}
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
            <input
                name="graduationYear"
                value={newUser.graduationYear}
                onChange={handleInputChange}
                placeholder="Graduation Year"
            />
            <input
                name="shortBio"
                value={newUser.shortBio}
                onChange={handleInputChange}
                placeholder="Short Bio"
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
  );
}

export default SignUp;
