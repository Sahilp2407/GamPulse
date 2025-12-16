import React from 'react';

const StatusBadge = ({ status }) => {
    const isLive = status === 'LIVE';

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isLive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.1)',
            border: `1px solid ${isLive ? 'var(--accent-red)' : 'var(--text-secondary)'}`,
            padding: '4px 12px',
            borderRadius: '20px',
            color: isLive ? 'var(--accent-red)' : 'var(--text-secondary)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: isLive ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none'
        }}>
            {isLive && (
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'currentColor',
                    animation: 'blink 1.5s infinite ease-in-out'
                }}></span>
            )}
            {status}
        </div>
    );
};

export default StatusBadge;
