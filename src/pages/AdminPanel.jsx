import React, { useState } from 'react';
import {
    Lock,
    Zap,
    LogOut,
    Activity,
    BarChart2,
    Target,
    Radio,
    Megaphone,
    Key,
    ArrowRight
} from 'lucide-react';

const AdminPanel = () => {
    // API URL from environment variable or default to localhost
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [commentary, setCommentary] = useState('');
    const [runs, setRuns] = useState('');
    const [wickets, setWickets] = useState('');
    const [message, setMessage] = useState('');
    const [gameId, setGameId] = useState('675d8f9e1234567890abcdef');

    // ... (Login handler same as before)
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Attemping login with:', { email, password });

        try {
            const response = await fetch(`${API_URL}/api/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('adminToken', data.data.token);
            setIsLoggedIn(true);
            setMessage('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.message);
        }
    };

    // ... (Send Commentary handler)
    const handleSendCommentary = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/commentary/${gameId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: commentary })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send');

            setMessage('Commentary broadcasted successfully!');
            setCommentary('');
        } catch (error) {
            setMessage(error.message);
        }
    };

    // ... (Update Score handler)
    const handleUpdateScore = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/admin/update-score`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ runs: parseInt(runs) })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update score');

            setMessage(`Score updated! Added ${runs} runs`);
            setRuns('');
        } catch (error) {
            setMessage(error.message);
        }
    };

    // ... (Update Wickets handler)
    const handleUpdateWickets = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/admin/update-wickets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ wickets: parseInt(wickets) })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update wickets');

            setMessage(`Wicket updated! Added ${wickets} wicket(s)`);
            setWickets('');
        } catch (error) {
            setMessage(error.message);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        setMessage('');
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    <div className="admin-logo">
                        <Lock className="admin-icon" size={28} />
                        <h1>Admin Portal</h1>
                        <p>GamePulse Control Center</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="admin-input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gamepulse.com"
                                required
                            />
                        </div>

                        <div className="admin-input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="admin-login-btn">
                            <span>Login to Dashboard</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {message && (
                        <div className={`admin-message ${message.includes('successful') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <div className="admin-credentials-box">
                        <div className="credentials-header">
                            <Key size={16} />
                            <strong>Demo Credentials</strong>
                        </div>
                        <div className="credentials-content">
                            <div className="cred-item">
                                <span className="cred-label">Email:</span>
                                <span className="cred-value">admin@gamepulse.com</span>
                            </div>
                            <div className="cred-item">
                                <span className="cred-label">Password:</span>
                                <span className="cred-value">admin123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel-page">
            <div className="admin-panel-header">
                <div className="header-left">
                    <Zap className="admin-icon-large" size={24} />
                    <div>
                        <h1>Admin Control Panel</h1>
                        <p>Manage live match updates and commentary</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">
                    <span>Logout</span>
                    <LogOut size={16} />
                </button>
            </div>

            <div className="admin-panel-content">
                <div className="admin-cards-grid">
                    {/* Score Update Card */}
                    <div className="admin-card">
                        <div className="card-header">
                            <Activity className="icon" size={20} />
                            <h2>Update Score</h2>
                        </div>

                        <form onSubmit={handleUpdateScore} className="commentary-form">
                            <div className="form-group">
                                <label>Add Runs</label>
                                <div className="runs-buttons">
                                    <button type="button" onClick={() => setRuns('1')} className="run-btn">1</button>
                                    <button type="button" onClick={() => setRuns('2')} className="run-btn">2</button>
                                    <button type="button" onClick={() => setRuns('3')} className="run-btn">3</button>
                                    <button type="button" onClick={() => setRuns('4')} className="run-btn run-four">4</button>
                                    <button type="button" onClick={() => setRuns('6')} className="run-btn run-six">6</button>
                                </div>
                                <input
                                    type="number"
                                    value={runs}
                                    onChange={(e) => setRuns(e.target.value)}
                                    placeholder="Or enter custom runs"
                                    className="admin-input"
                                    min="0"
                                />
                            </div>

                            <button type="submit" className="admin-send-btn" disabled={!runs}>
                                <BarChart2 className="icon" size={16} />
                                <span>Update Score</span>
                            </button>
                        </form>
                    </div>

                    {/* Wickets Update Card */}
                    <div className="admin-card">
                        <div className="card-header">
                            <Target className="icon" size={20} />
                            <h2>Update Wickets</h2>
                        </div>

                        <form onSubmit={handleUpdateWickets} className="commentary-form">
                            <div className="form-group">
                                <label>Add Wickets</label>
                                <div className="runs-buttons">
                                    <button type="button" onClick={() => setWickets('1')} className="run-btn wicket-btn">+1 Wicket</button>
                                </div>
                                <input
                                    type="number"
                                    value={wickets}
                                    onChange={(e) => setWickets(e.target.value)}
                                    placeholder="Or enter custom wickets"
                                    className="admin-input"
                                    min="0"
                                    max="10"
                                />
                            </div>

                            <button type="submit" className="admin-send-btn" disabled={!wickets}>
                                <Target className="icon" size={16} />
                                <span>Update Wickets</span>
                            </button>
                        </form>
                    </div>


                    {/* Commentary Card */}
                    <div className="admin-card">
                        <div className="card-header">
                            <Radio className="icon" size={20} />
                            <h2>Live Commentary</h2>
                        </div>

                        <form onSubmit={handleSendCommentary} className="commentary-form">
                            <div className="form-group">
                                <label>Commentary Text</label>
                                <textarea
                                    value={commentary}
                                    onChange={(e) => setCommentary(e.target.value)}
                                    placeholder="What a brilliant shot! That's a six over long-on..."
                                    rows="6"
                                    className="admin-textarea"
                                    required
                                />
                                <small>This will be broadcasted live to all viewers via Socket.IO</small>
                            </div>

                            <button type="submit" className="admin-send-btn">
                                <Megaphone className="icon" size={16} />
                                <span>Broadcast Commentary</span>
                            </button>
                        </form>
                    </div>
                </div>

                {message && (
                    <div className={`admin-message ${message.includes('successful') || message.includes('updated') || message.includes('broadcasted') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="admin-info-cards">
                    <div className="info-card">
                        <Target className="info-icon" size={20} />
                        <h3>Score Control</h3>
                        <p>Update match score in real-time. Click quick buttons (1,2,3,4,6) or enter custom runs</p>
                    </div>

                    <div className="info-card">
                        <Zap className="info-icon" size={20} />
                        <h3>Live Updates</h3>
                        <p>All changes are broadcasted instantly to viewers watching the match</p>
                    </div>

                    <div className="info-card">
                        <Lock className="info-icon" size={20} />
                        <h3>Admin Only</h3>
                        <p>Only authenticated admins can control match updates using JWT authorization</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
