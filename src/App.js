import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SignUp from './pages/SignUp';
import Start from "./pages/Start";
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ForEditor from './pages/ForEditor';
import Submissions from './pages/Submissions';
import Terms from './FooterPages/Terms';
import Contact from './FooterPages/Contact';
import Privacy from './FooterPages/Privacy';
import Footer from "./components/Footer";
import axios from "axios";
import {API_URL} from "./util/URL";

function App() {
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
      <Router>
        <div className="app">
          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/login" />} />
            <Route path="/home/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/home/for-editor" element={currentUser && userDetails ? (userDetails.userType === 'ADMIN' ? <ForEditor /> : <Navigate to="/home" />) : <Navigate to="/login" />} />
            <Route path="/home/submissions" element={currentUser ? <Submissions /> : <Navigate to="/login" />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer/>
        </div>
      </Router>
  );
}

export default App;
