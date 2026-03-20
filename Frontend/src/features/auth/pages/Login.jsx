import React, { useState } from 'react';
import '../auth.form.scss';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import studyPrepIllustration from '../../../assets/study_prep_illustration.png';

const Login = () => {
    const navigate = useNavigate();
    const { loading, handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({ email, password });
        navigate("/");
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '300', letterSpacing: '0.2rem' }}>
                    INITIALIZING SECURE SESSION...
                </div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-container">
                {/* Left Panel - Branding */}
                <section className="branding-panel">
                    <div className="branding-header">
                        <div className="header-top">AI INTERVIEW PREP</div>
                        <div className="header-sub">Master your professional journey with AI.</div>
                    </div>

                    <div className="hero-section">
                        <div className="glass-headline">
                            <h2>THE FUTURE OF CAREERS</h2>
                        </div>
                        <div className="globe-container">
                            <img src={studyPrepIllustration} alt="Study Prep Illustration" className="globe-asset" />
                        </div>
                    </div>

                    <div className="branding-footer">
                        <div className="mini-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Right Panel - Action */}
                <section className="action-panel">
                    <header className="panel-header">
                        <div className="logo-placeholder">ANTIGRAVITY</div>
                        <div className="signup-link-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </div>
                    </header>

                    <div className="form-content">
                        <h3>Sign In</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Email or Username</label>
                                <div className="input-wrapper">
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email or Username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <a href="#" className="forgot-pass">Forgot password?</a>

                            <button className="primary-button" type="submit">
                                PROCEED TO SIGN IN
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </form>

                        <div className="separator">— or sign up for a new account —</div>

                        <Link to="/Register" className="secondary-button">
                            CREATE FREE ACCOUNT
                        </Link>
                    </div>

                    <footer className="panel-footer">
                        <div className="copyright">© 2026 Antigravity Inc.</div>
                        <div className="footer-links">
                            <a href="#">Contact Us</a>
                            <div className="lang-dropdown">
                                English
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </footer>
                </section>
            </div>
        </main>
    );
}

export default Login;
