import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import {
    MapPin,
    TrendingUp,
    Target,
    MessageSquare,
    ArrowLeft,
    Users,
    Clock,
    Activity,
    CloudSun
} from 'lucide-react';

const LiveMatch = () => {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState({
        teamA: 'India',
        teamB: 'Australia',
        scoreA: 0,
        scoreB: 0,
        wicketsA: 0,
        wicketsB: 0,
        overs: '0.0',
        status: 'LIVE'
    });
    const [commentary, setCommentary] = useState([]);
    const [scoreAnimation, setScoreAnimation] = useState(false);
    const [runDifference, setRunDifference] = useState(null);
    const [showAllOutPopup, setShowAllOutPopup] = useState(false);
    const [playerStats, setPlayerStats] = useState({
        currentBatsmen: [],
        currentBowler: null,
        nextBatsman: null
    });
    const prevScoreRef = useRef(0);
    const prevWicketsRef = useRef(0);

    useEffect(() => {
        // Listen for score updates
        socket.on('scoreUpdate', (data) => {
            const oldScore = prevScoreRef.current;
            const newScore = data.scoreA;

            // Calculate run difference
            if (oldScore > 0 && newScore > oldScore) {
                const diff = newScore - oldScore;
                setRunDifference(diff);
                setScoreAnimation(true);

                // Remove animation after 2 seconds
                setTimeout(() => {
                    setScoreAnimation(false);
                    setRunDifference(null);
                }, 2000);
            }

            prevScoreRef.current = newScore;
            setMatchData(data);
        });

        // Listen for new commentary
        socket.on('newCommentary', (data) => {
            setCommentary((prev) => [data, ...prev].slice(0, 10)); // Keep last 10
        });

        // ✅ Listen for player stats updates
        socket.on('playerStatsUpdate', (data) => {
            setPlayerStats({
                currentBatsmen: data.currentBatsmen || [],
                currentBowler: data.currentBowler || null,
                nextBatsman: data.nextBatsman || null
            });
        });

        return () => {
            socket.off('scoreUpdate');
            socket.off('newCommentary');
            socket.off('playerStatsUpdate');
        };
    }, []);

    // Check for ALL OUT (10 wickets)
    useEffect(() => {
        if (matchData.wicketsA === 10 && prevWicketsRef.current < 10) {
            // Show ALL OUT popup
            setShowAllOutPopup(true);

            // Hide popup and reset runs after 3 seconds
            setTimeout(() => {
                setShowAllOutPopup(false);

                // Reset runs to 0
                setMatchData(prev => ({
                    ...prev,
                    scoreA: 0,
                    wicketsA: 0,
                    overs: '0.0'
                }));
                prevScoreRef.current = 0;
                prevWicketsRef.current = 0;
            }, 3000);
        }

        prevWicketsRef.current = matchData.wicketsA;
    }, [matchData.wicketsA]);

    // Calculate run rate
    const calculateRunRate = () => {
        const overs = parseFloat(matchData.overs) || 0;
        if (overs === 0) return '0.00';
        return (matchData.scoreA / overs).toFixed(2);
    };

    return (
        <div className="live-match-page">
            {/* Header */}
            {/* Header */}
            <header className="match-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
                <div className="match-title">
                    <h1>T20 International</h1>
                    <span className="venue" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        <MapPin size={16} />
                        Wankhede Stadium, Mumbai
                    </span>
                </div>
                <div className="live-indicator-top">
                    <span className="live-dot"></span>
                    LIVE
                </div>
            </header>

            {/* Main Score Section */}
            <div className="score-section">
                <div className="teams-header">
                    <div className="team-info">
                        <div className="team-flag font-bold">IND</div>
                        <div className="team-details">
                            <h2>{matchData.teamA}</h2>
                            <span className="team-label">Batting</span>
                        </div>
                    </div>
                    <div className="vs-badge">VS</div>
                    <div className="team-info">
                        <div className="team-flag font-bold">AUS</div>
                        <div className="team-details">
                            <h2>{matchData.teamB}</h2>
                            <span className="team-label">Bowling</span>
                        </div>
                    </div>
                </div>

                <div className="score-display">
                    <div className="main-score">
                        <div className={`score-number ${scoreAnimation ? 'score-pulse' : ''}`}>
                            {matchData.scoreA}
                            <span className="wickets-display">/{matchData.wicketsA || 0}</span>
                            {runDifference && (
                                <span className="run-increment">+{runDifference}</span>
                            )}
                        </div>
                        <div className="score-label">RUNS</div>
                    </div>

                    <div className="score-stats">
                        <div className="stat-item">
                            <span className="stat-label">Wickets</span>
                            <span className="stat-value">{matchData.wicketsA || 0}/10</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-label">Overs</span>
                            <span className="stat-value">{matchData.overs}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-label">Run Rate</span>
                            <span className="stat-value">{calculateRunRate()}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-label">Status</span>
                            <span className="stat-value status-live">{matchData.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Stats Section */}
            <div className="player-stats-section">
                {/* Current Batsmen */}
                <div className="player-stats-panel">
                    <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={20} />
                        Current Batsmen
                    </h3>
                    <div className="batsmen-grid">
                        {playerStats.currentBatsmen.map((batsman, index) => (
                            <div key={batsman.id} className={`batsman-card ${batsman.isOnStrike ? 'on-strike' : ''}`}>
                                <div className="player-header">
                                    <div className="player-name">{batsman.name}</div>
                                    {batsman.isOnStrike && <span className="strike-badge">*</span>}
                                </div>
                                <div className="player-stats-grid">
                                    <div className="stat">
                                        <span className="stat-label">Runs</span>
                                        <span className="stat-value">{batsman.runs}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Balls</span>
                                        <span className="stat-value">{batsman.balls}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">4s</span>
                                        <span className="stat-value">{batsman.fours}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">6s</span>
                                        <span className="stat-value">{batsman.sixes}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">SR</span>
                                        <span className="stat-value">{batsman.strikeRate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Bowler */}
                {playerStats.currentBowler && (
                    <div className="player-stats-panel">
                        <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={20} />
                            Current Bowler
                        </h3>
                        <div className="bowler-card">
                            <div className="player-header">
                                <div className="player-name">{playerStats.currentBowler.name}</div>
                                <span className="team-badge">{playerStats.currentBowler.team}</span>
                            </div>
                            <div className="player-stats-grid">
                                <div className="stat">
                                    <span className="stat-label">Overs</span>
                                    <span className="stat-value">{playerStats.currentBowler.overs}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Runs</span>
                                    <span className="stat-value">{playerStats.currentBowler.runs}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Wickets</span>
                                    <span className="stat-value">{playerStats.currentBowler.wickets}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Economy</span>
                                    <span className="stat-value">{playerStats.currentBowler.economy}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Batsman */}
                {playerStats.nextBatsman && (
                    <div className="player-stats-panel next-batsman-panel">
                        <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={20} />
                            Next Batsman
                        </h3>
                        <div className="next-batsman-card">
                            <div className="player-name">{playerStats.nextBatsman.name}</div>
                            <span className="ready-badge">Ready</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Commentary Section */}
            <div className="commentary-section">
                <div className="commentary-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={20} />
                        Live Commentary
                    </h3>
                    <span className="commentary-count">{commentary.length} updates</span>
                </div>

                <div className="commentary-feed">
                    {commentary.length === 0 ? (
                        <div className="no-commentary">
                            <Clock size={24} className="text-secondary" />
                            <p>Waiting for commentary updates...</p>
                        </div>
                    ) : (
                        commentary.map((item, index) => (
                            <div key={index} className="commentary-item">
                                <div className="commentary-meta">
                                    <span className="commentary-time">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </span>
                                    <span className="commentary-over">{matchData.overs} ov</span>
                                </div>
                                <div className="commentary-text">{item.text}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Match Info Footer */}
            <div className="match-info-footer">
                <div className="info-item">
                    <Activity size={16} className="info-icon" />
                    <span className="info-text">T20 Format • 20 Overs</span>
                </div>
                <div className="info-item">
                    <CloudSun size={16} className="info-icon" />
                    <span className="info-text">Clear Sky • 28°C</span>
                </div>
                <div className="info-item">
                    <Users size={16} className="info-icon" />
                    <span className="info-text">Crowd: 45,000</span>
                </div>
            </div>

            {/* ALL OUT Popup */}
            {showAllOutPopup && (
                <div className="all-out-overlay">
                    <div className="all-out-popup">
                        <div className="all-out-icon"><TrendingUp size={48} /></div>
                        <h1 className="all-out-title">ALL OUT!</h1>
                        <p className="all-out-message">
                            {matchData.teamA} all out for {matchData.scoreA} runs
                        </p>
                        <div className="all-out-wickets">10 Wickets</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveMatch;
