import React from 'react';
import "./Contact.css"
import Header from "../components/Header";

const Contact = () => {
    return (
        <div>
            <Header />
            <h1>Welcome to The Pioneer</h1>
            <footer>
                <p>Contact us via email: <a href="mailto:pioneer@cooper.edu?subject=Feedback from The Pioneer&body=Hi there, please write your message here.">pioneer@cooper.edu</a></p>
            </footer>
        </div>
    );
};

export default Contact;
