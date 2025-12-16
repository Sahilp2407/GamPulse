import React, { useEffect, useRef } from 'react';

const CommentaryFeed = ({ comments }) => {
    // We'll use a ref if we want to auto-scroll, but for "latest on top", standard mapping is fine.
    // Assuming 'comments' is an array where index 0 is the newest.

    return (
        <div className="glass-panel" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '400px' // giving it a fixed height for visual balance
        }}>
            <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-secondary)'
            }}>
                <span style={{ fontSize: '1.5rem' }}>🎙</span> Live Commentary
            </h3>

            <div style={{
                overflowY: 'auto',
                paddingRight: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }} className="custom-scrollbar">
                {comments.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        Waiting for commentary...
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} style={{
                            padding: '12px',
                            background: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                            borderLeft: index === 0 ? '3px solid var(--accent-blue)' : '3px solid transparent',
                            borderRadius: '0 8px 8px 0',
                            animation: 'slide-in 0.3s ease-out forwards',
                            opacity: 0,
                            transform: 'translateY(-10px)',
                            animationDelay: `${index * 0.05}s`
                        }}>
                            <div style={{
                                fontSize: '0.8rem',
                                color: index === 0 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                marginBottom: '4px',
                                fontWeight: '600'
                            }}>
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div style={{ lineHeight: '1.5', fontSize: '1rem' }}>
                                {comment.text}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentaryFeed;
