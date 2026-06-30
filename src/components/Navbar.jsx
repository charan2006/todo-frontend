import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo">
                    ✅ TaskMaster
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`navbar-link ${isActive('/') ? 'navbar-link-active' : ''}`}>
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link to="/todos" className={`navbar-link ${isActive('/todos') ? 'navbar-link-active' : ''}`}>
                                My Tasks
                            </Link>
                            <Link to="/chat" className={`navbar-link ${isActive('/chat') ? 'navbar-link-active' : ''}`}>
                                Chat
                            </Link>
                            <div className="navbar-user">
                                <div className="navbar-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="navbar-username">{user.username}</span>
                            </div>
                            <button className="navbar-logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`navbar-link ${isActive('/login') ? 'navbar-link-active' : ''}`}>
                                Login
                            </Link>
                            <Link to="/register" className="navbar-register-btn">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {menuOpen && (
                <div className="navbar-mobile-menu">
                    <Link to="/" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                        🏠 Home
                    </Link>
                    {user ? (
                        <>
                            <Link to="/todos" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                                📋 My Tasks
                            </Link>
                            <Link to="/chat" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                                🤖 Chat
                            </Link>
                            <div className="navbar-mobile-user">
                                👋 {user.username}
                            </div>
                            <button className="navbar-mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                                🔑 Login
                            </Link>
                            <Link to="/register" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                                📝 Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;