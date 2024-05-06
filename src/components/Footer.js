import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; 2024 <a href="/" className="pioneer-link">THE PIONEER</a>. All rights reserved.</p>
                <div className="footer-links">

                    <Link to="/terms">Terms of Service</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/contact">Contact</Link>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
