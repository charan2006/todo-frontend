import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../api";

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${BASE_URL}/users/login`, {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">To-do Login</h2>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label className="auth-label">Email</label>
                        <input
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;