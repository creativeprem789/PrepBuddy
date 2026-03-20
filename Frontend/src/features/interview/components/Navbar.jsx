import React from 'react';

const Navbar = () => {
    return (
        <nav className="pb-navbar">
            <div className="pb-container">
                <div className="pb-logo">
                    <span className="brand-name">PrepBuddy</span>
                    <span className="divider">|</span>
                    <span className="tagline">Turn Interviews into Insights</span>
                </div>
                <ul className="pb-nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
