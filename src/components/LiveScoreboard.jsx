import React, { useEffect, useState } from 'react';
import StatusBadge from './StatusBadge';

const LiveScoreboard = ({ data }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation on score update
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [data.scoreA]);

    if (!data) return <div className="glass-panel">Loading Match Data...</div>;

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
            {/* Background Glow Effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(0,255,157,0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header Row */}
                <div className="flex-between">
                    <StatusBadge status={data.status} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Match ID: #{data.matchId}</span>
                </div>

                {/* Teams & Score Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '2rem' }}>

                    {/* Team A */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            {data.teamA}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Batting</div>
                    </div>

                    {/* Score Display */}
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem 2rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        transform: animate ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div style={{
                            fontSize: '4.5rem',
                            fontWeight: '900',
                            lineHeight: 1,
                            color: animate ? 'var(--accent-neon)' : 'var(--text-primary)',
                            transition: 'color 0.3s ease'
                        }}>
                            {data.scoreA}<span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>/{data.scoreB}</span>
                        </div>
                        <div style={{
                            fontSize: '1.2rem',
                            color: 'var(--accent-blue)',
                            fontWeight: '600',
                            marginTop: '0.5rem'
                        }}>
                            {data.overs} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>OVERS</span>
                        </div>
                    </div>

                    {/* Team B */}
                    <div style={{ textAlign: 'center', opacity: 0.7 }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                            {data.teamB}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Bowling</div>
                    </div>

                </div>

                {/* Footer/CRR */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                    }}>
                        Current Run Rate: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                            {((data.scoreA) / (parseFloat(data.overs) || 1)).toFixed(2)}
                        </span>
                    </span>
                </div>

            </div>
        </div>
    );
};

export default LiveScoreboard;
