import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user, todolist }) => {
    const totalTasks = todolist?.length || 0;
    const completedTasks = todolist?.filter(t => t.status).length || 0;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (user) {
        return (
            <div className="home-user-container">
                <div className="home-user-box">
                    <div className="home-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="home-welcome-title">Welcome back, {user.username}! 👋</h1>
                    <p className="home-welcome-email">{user.email}</p>

                    <div className="home-stats">
                        <div className="home-stat">
                            <div className="home-stat-number">{totalTasks}</div>
                            <div className="home-stat-label">Total</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-number" style={{ color: '#10b981' }}>
                                {completedTasks}
                            </div>
                            <div className="home-stat-label">Done</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-number" style={{ color: '#f59e0b' }}>
                                {pendingTasks}
                            </div>
                            <div className="home-stat-label">Pending</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-number" style={{ color: '#667eea' }}>
                                {completionRate}%
                            </div>
                            <div className="home-stat-label">Done Rate</div>
                        </div>
                    </div>

                    {totalTasks > 0 && (
                        <div className="home-progress-wrapper">
                            <div className="home-progress-label">
                                <span>Progress</span>
                                <span>{completionRate}%</span>
                            </div>
                            <div className="home-progress-bar">
                                <div className="home-progress-fill" style={{ width: `${completionRate}%` }} />
                            </div>
                        </div>
                    )}

                    <Link to="/todos" className="home-go-btn">
                        Go to My Tasks →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">

            {/* Hero */}
            <div className="home-hero">
                <div className="home-hero-inner">
                    <div className="home-hero-content">
                        <span className="home-logo"></span>
                        <h1 className="home-title">TaskMaster</h1>
                        <p className="home-subtitle">
                            Stay organized, stay productive. Manage your tasks
                            with ease and never miss a deadline again.
                        </p>
                        <div className="home-buttons">
                            <Link to="/register" className="home-btn-primary">
                                Get Started Free 🚀
                            </Link>
                            <Link to="/login" className="home-btn-secondary">
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* <div className="home-hero-visual">
                        <div className="home-hero-card">
                            <div className="hero-task done">✅ Design the UI</div>
                            <div className="hero-task done">✅ Set up backend</div>
                            <div className="hero-task pending">⬜ Deploy to production</div>
                            <div className="hero-task pending">⬜ Write documentation</div>
                            <div className="hero-progress">
                                <div className="hero-progress-bar">
                                    <div className="hero-progress-fill" style={{ width: '50%' }} />
                                </div>
                                <span>50% complete</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Features */}
            <div className="home-features-section">
                <h2 className="home-features-title">Everything you need</h2>
                <div className="home-features">
                    <div className="home-feature-card">
                        <div className="home-feature-icon">📋</div>
                        <div className="home-feature-title">Task Management</div>
                        <div className="home-feature-desc">Create and organize tasks effortlessly</div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">⚡</div>
                        <div className="home-feature-title">Subtasks</div>
                        <div className="home-feature-desc">Break down big tasks into smaller steps</div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">🎯</div>
                        <div className="home-feature-title">Priorities</div>
                        <div className="home-feature-desc">Set High, Medium or Low priorities</div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">📅</div>
                        <div className="home-feature-title">Deadlines</div>
                        <div className="home-feature-desc">Track start and due dates easily</div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">🔄</div>
                        <div className="home-feature-title">Restore</div>
                        <div className="home-feature-desc">Recover accidentally deleted tasks</div>
                    </div>
                    <div className="home-feature-card">
                        <div className="home-feature-icon">🔒</div>
                        <div className="home-feature-title">Secure</div>
                        <div className="home-feature-desc">Your data is private and protected</div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="home-cta">
                <h2 className="home-cta-title">Ready to get organized?</h2>
                <p className="home-cta-subtitle">Join thousands of users managing their tasks with TaskMaster</p>
                <Link to="/register" className="home-btn-primary">
                    Start for Free →
                </Link>
            </div>

        </div>
    );
};

export default Home;