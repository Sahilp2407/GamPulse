import React from 'react';

const Header = () => {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--accent-neon), var(--accent-blue))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#000'
                }}>
                    G
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Game<span className="neon-text">Pulse</span>
                    </h1>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Live Match Engine
                    </span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon)' }}></div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Connected</span>
            </div>
        </header>
    );
};

export default Header;
