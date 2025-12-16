import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="badge-container">
                        <span className="live-badge">● LIVE ENGINE</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="brand-name animated-gradient-text">GamePulse</span>
                        <span className="hero-subtitle">Real-Time Sports. Zero Delay.</span>
                    </h1>

                    <button className="cta-button primary-glow" onClick={() => navigate('/dashboard')}>
                        Enter Live Dashboard <span className="arrow">→</span>
                    </button>

                    <div className="scroll-hint">
                        <span className="hint-text">Scroll to explore</span>
                        <div className="scroll-arrow">↓</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="content-section animate-on-scroll">
                <h2 className="section-heading">Premium Features</h2>
                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">⚡</span>
                        </div>
                        <h3>Live Scores</h3>
                        <p>Instant updates pushed directly from the field with millisecond precision.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">🎙</span>
                        </div>
                        <h3>Real-Time Commentary</h3>
                        <p>Play-by-play analysis as it happens, keeping you in the heart of the action.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="feature-icon-wrapper">
                            <span className="feature-icon">🚀</span>
                        </div>
                        <h3>WebSocket Powered</h3>
                        <p>Zero-latency bi-directional connection ensuring you never miss a moment.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="content-section alt-bg animate-on-scroll">
                <h2 className="section-heading">How GamePulse Works</h2>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">01</div>
                        <h4>Live Match Engine</h4>
                        <div className="step-tech">Node.js + Socket.IO</div>
                        <p>Our backend engine simulates or fetches live data streams instantly.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">02</div>
                        <h4>Real-Time Events</h4>
                        <div className="step-tech">Bi-Directional Events</div>
                        <p>Scores, wickets, and commentary are pushed to connected clients.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">03</div>
                        <h4>Instant UI Updates</h4>
                        <div className="step-tech">React State Sync</div>
                        <p>Your dashboard updates immediately without page refreshes.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">GamePulse</div>
                    <div className="footer-links">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Contact</span>
                        <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer', color: 'var(--primary-neon)' }}>Admin Login</span>
                    </div>
                    <div className="footer-copy">&copy; 2025 GamePulse Inc.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
