import React from 'react';

const Footer = () => {
    return (
        <footer className="pb-footer">
            <div className="pb-container">
                <p>Built with ❤️ by PrepBuddy</p>
                <p className="footer-credits">&copy; {new Date().getFullYear()} PrepBuddy. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
