import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import socket from '../socket';
import {
    LayoutDashboard,
    Signal,
    BarChart2,
    Trophy,
    Users,
    Settings,
    Zap,
    Activity,
    Wifi,
    MapPin,
    PlayCircle,
    CheckCircle,
    Mic
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [liveMatchData, setLiveMatchData] = useState({
        teamA: 'India',
        teamB: 'Australia',
        scoreA: 0,
        overs: '0.0',
        status: 'LIVE'
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        // Listen for real-time score updates
        const onScoreUpdate = (data) => {
            setLiveMatchData(data);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('scoreUpdate', onScoreUpdate);

        return () => {
            clearInterval(timer);
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('scoreUpdate', onScoreUpdate);
        };
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Mock data for other matches
    const otherMatches = [
        {
            id: 2,
            teamA: { name: 'England', code: 'ENG', score: '189/7' },
            teamB: { name: 'Pakistan', code: 'PAK', score: '156/5' },
            format: 'ODI',
            status: 'LIVE',
            overs: '35.2/50'
        },
        {
            id: 3,
            teamA: { name: 'South Africa', code: 'RSA', score: '312/8' },
            teamB: { name: 'New Zealand', code: 'NZL', score: '298/9' },
            format: 'Test',
            status: 'LIVE',
            overs: 'Day 2'
        },
        {
            id: 4,
            teamA: { name: 'West Indies', code: 'WI', score: '145/4' },
            teamB: { name: 'Bangladesh', code: 'BAN', score: '142/10' },
            format: 'T20',
            status: 'LIVE',
            overs: '12.4/20'
        },
        {
            id: 5,
            teamA: { name: 'Sri Lanka', code: 'SL', score: '267/6' },
            teamB: { name: 'Afghanistan', code: 'AFG', score: '198/8' },
            format: 'ODI',
            status: 'Finished',
            overs: 'SL won'
        }
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar-modern">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <Zap className="logo-icon" size={28} />
                        <span className="logo-text">GamePulse</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                        <LayoutDashboard className="icon" size={20} />
                        <span className="label">Dashboard</span>
                    </Link>
                    <Link to="/match" className="nav-item nav-live">
                        <Signal className="icon" size={20} />
                        <span className="label">Live Match</span>
                        <span className="live-indicator">LIVE</span>
                    </Link>
                    <Link to="/analytics" className="nav-item">
                        <BarChart2 className="icon" size={20} />
                        <span className="label">Analytics</span>
                    </Link>
                    <Link to="/tournaments" className="nav-item">
                        <Trophy className="icon" size={20} />
                        <span className="label">Tournaments</span>
                    </Link>
                    <Link to="/teams" className="nav-item">
                        <Users className="icon" size={20} />
                        <span className="label">Teams</span>
                    </Link>
                    <Link to="/settings" className="nav-item">
                        <Settings className="icon" size={20} />
                        <span className="label">Settings</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-card">
                        <div className="avatar-gradient">AD</div>
                        <div className="user-details">
                            <span className="user-name">Admin User</span>
                            <span className="user-badge">Pro Account</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="top-bar">
                    <div className="header-content">
                        <div>
                            <h1 className="page-title">Dashboard</h1>
                            <p className="page-subtitle">Real-time cricket match monitoring</p>
                        </div>
                        <div className="header-actions">
                            <div className="time-display">{currentTime}</div>
                            <div className={`status-pill ${isConnected ? 'connected' : 'disconnected'}`}>
                                <span className="status-dot"></span>
                                {isConnected ? 'Connected' : 'Offline'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-box stat-primary">
                        <div className="stat-header">
                            <Activity className="stat-icon" size={24} />
                            <span className="stat-trend up">+12%</span>
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-label">Live Matches</div>
                    </div>

                    <div className="stat-box stat-success">
                        <div className="stat-header">
                            <Users className="stat-icon" size={24} />
                            <span className="stat-trend up">+8%</span>
                        </div>
                        <div className="stat-value">1,245</div>
                        <div className="stat-label">Active Viewers</div>
                    </div>

                    <div className="stat-box stat-info">
                        <div className="stat-header">
                            <Zap className="stat-icon" size={24} />
                            <span className="stat-trend stable">0%</span>
                        </div>
                        <div className="stat-value">{isConnected ? 'Active' : 'Down'}</div>
                        <div className="stat-label">Socket Status</div>
                    </div>

                    <div className="stat-box stat-warning">
                        <div className="stat-header">
                            <Wifi className="stat-icon" size={24} />
                            <span className="stat-trend stable">0ms</span>
                        </div>
                        <div className="stat-value">24ms</div>
                        <div className="stat-label">Avg Latency</div>
                    </div>
                </div>

                <div className="content-grid">
                    <div className="main-content-area">
                        <div className="featured-match-panel">
                            <div className="panel-top">
                                <div className="panel-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trophy size={20} className="text-accent" style={{ color: '#fbbf24' }} />
                                    <h2 className="panel-title">Featured Match</h2>
                                </div>
                                <span className="live-badge-animated">LIVE</span>
                            </div>

                            <div className="match-card-large">
                                <div className="match-stadium-bg"></div>
                                <div className="match-overlay">
                                    <div className="match-info-top">
                                        <span className="match-format">T20 Finals</span>
                                        <span className="match-venue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} />
                                            Wankhede Stadium
                                        </span>
                                    </div>

                                    <div className="teams-container">
                                        <div className="team-side">
                                            <div className="team-flag-large">IND</div>
                                            <div className="team-name-large">{liveMatchData.teamA}</div>
                                            <div className="team-score">{liveMatchData.scoreA}</div>
                                        </div>

                                        <div className="match-vs">
                                            <div className="vs-circle">VS</div>
                                            <div className="match-status">{liveMatchData.status}</div>
                                        </div>

                                        <div className="team-side">
                                            <div className="team-flag-large">AUS</div>
                                            <div className="team-name-large">{liveMatchData.teamB}</div>
                                            <div className="team-score">{liveMatchData.scoreB || '--'}</div>
                                        </div>
                                    </div>

                                    <div className="match-stats-row">
                                        <div className="mini-stat">
                                            <span className="mini-label">Overs</span>
                                            <span className="mini-value">{liveMatchData.overs}</span>
                                        </div>
                                        <div className="mini-stat">
                                            <span className="mini-label">Run Rate</span>
                                            <span className="mini-value">
                                                {liveMatchData.overs && parseFloat(liveMatchData.overs) > 0
                                                    ? (liveMatchData.scoreA / parseFloat(liveMatchData.overs)).toFixed(2)
                                                    : '0.00'}
                                            </span>
                                        </div>
                                        <div className="mini-stat">
                                            <span className="mini-label">Team</span>
                                            <span className="mini-value">{liveMatchData.teamA}</span>
                                        </div>
                                    </div>

                                    <button className="watch-live-btn" onClick={() => navigate('/match')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <PlayCircle size={18} />
                                        <span>Watch Live</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Other Live Matches Section */}
                        <div className="other-matches-section">
                            <div className="section-header">
                                <h3 className="section-title">Other Live Matches</h3>
                                <span className="match-count">{otherMatches.length} matches</span>
                            </div>

                            <div className="matches-grid">
                                {otherMatches.map((match) => (
                                    <div key={match.id} className="match-card-compact">
                                        <div className="match-card-header">
                                            <span className="match-format-badge">{match.format}</span>
                                            <span className={`match-status-badge ${match.status.toLowerCase()}`}>
                                                {match.status === 'LIVE' && <span className="status-dot"></span>}
                                                {match.status}
                                            </span>
                                        </div>

                                        <div className="teams-row">
                                            <div className="team-compact">
                                                <span className="team-flag-small" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{match.teamA.code}</span>
                                                <span className="team-name-small">{match.teamA.name}</span>
                                                <span className="team-score-small">{match.teamA.score}</span>
                                            </div>

                                            <div className="team-compact">
                                                <span className="team-flag-small" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{match.teamB.code}</span>
                                                <span className="team-name-small">{match.teamB.name}</span>
                                                <span className="team-score-small">{match.teamB.score}</span>
                                            </div>
                                        </div>

                                        <div className="match-card-footer">
                                            <span className="match-overs">{match.overs}</span>
                                            <button className="quick-view-btn" onClick={() => navigate('/match')}>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="side-panels">
                        <div className="recent-activity-panel">
                            <div className="panel-top">
                                <h3 className="panel-title-small">Recent Activity</h3>
                            </div>
                            <div className="activity-feed">
                                <div className="activity-entry">
                                    <div className="activity-icon success">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text">Match started successfully</div>
                                        <div className="activity-time">2 min ago</div>
                                    </div>
                                </div>
                                <div className="activity-entry">
                                    <div className="activity-icon info">
                                        <Activity size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text">Score updated: 178/4</div>
                                        <div className="activity-time">5 min ago</div>
                                    </div>
                                </div>
                                <div className="activity-entry">
                                    <div className="activity-icon warning">
                                        <Users size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text">245 new viewers joined</div>
                                        <div className="activity-time">8 min ago</div>
                                    </div>
                                </div>
                                <div className="activity-entry">
                                    <div className="activity-icon success">
                                        <Mic size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text">Commentary feed synced</div>
                                        <div className="activity-time">12 min ago</div>
                                    </div>
                                </div>
                                <div className="activity-entry">
                                    <div className="activity-icon info">
                                        <Zap size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-text">System health check passed</div>
                                        <div className="activity-time">15 min ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="quick-stats-panel">
                            <div className="panel-top">
                                <h3 className="panel-title-small">Quick Stats</h3>
                            </div>
                            <div className="quick-stats-list">
                                <div className="quick-stat-item">
                                    <span className="qs-label">Total Matches Today</span>
                                    <span className="qs-value">5</span>
                                </div>
                                <div className="quick-stat-item">
                                    <span className="qs-label">Peak Viewers</span>
                                    <span className="qs-value">2.1K</span>
                                </div>
                                <div className="quick-stat-item">
                                    <span className="qs-label">Uptime</span>
                                    <span className="qs-value success">99.9%</span>
                                </div>
                                <div className="quick-stat-item">
                                    <span className="qs-label">Data Synced</span>
                                    <span className="qs-value">1.2GB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
