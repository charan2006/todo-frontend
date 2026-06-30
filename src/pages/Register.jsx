import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../api";

const Register = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`${BASE_URL}/users/register`, {
                username,
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            setUser(res.data);
            navigate("/");
        } catch (err) {
            console.log(err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Register</h2>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label className="auth-label">Username</label>
                        <input
                            type="text"
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

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
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Register
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;