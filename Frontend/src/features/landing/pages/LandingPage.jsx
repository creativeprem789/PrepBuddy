import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { getMe } from '../../auth/services/auth.api';
import '../landing.scss';

const LandingPage = () => {

    useEffect(() => {
        // Silent ping to wake up free-tier backend (Render)
        // Ignoring the promise result as we don't care if it fails
        // We only care that the network request hits the backend
        getMe().catch(() => {});
    }, []);

    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="logo">PrepBuddy</div>
                <div className="auth-buttons">
                    <Link to="/login" className="nav-button login">Login</Link>
                    <Link to="/register" className="nav-button register">Register</Link>
                </div>
            </nav>

            <main className="hero-content">
                <section className="text-section">
                    <h1>
                        Master Your <br/>
                        <span className="highlight">Interview</span>
                    </h1>
                    <p>
                        Our AI models analyze your resume, generate personalized technical questions, and pinpoint your skill gaps before you even step into the room.
                    </p>
                    <div className="cta-container">
                        <Link to="/register" className="cta-main">Start Practicing Free</Link>
                    </div>
                </section>

                <section className="visual-section">
                    <div className="visual-card">
                        <h3>How it works</h3>
                        <ul>
                            <li>Upload your resume (PDF)</li>
                            <li>AI parses your skill profile</li>
                            <li>Take a simulated interview</li>
                            <li>Get brutal, raw feedback</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LandingPage;
