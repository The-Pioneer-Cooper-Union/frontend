import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; 2024 <a href="/" className="pioneer-link">THE PIONEER</a>. All rights reserved.</p>
                <div className="footer-links">

                    <a href="/terms">Terms of Service</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/contact">Contact</a>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
