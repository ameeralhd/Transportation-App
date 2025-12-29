import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show back button on Home page
    if (location.pathname === '/') return null;

    return (
        <button
            onClick={() => navigate(-1)}
            style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '1rem',
                padding: '10px 0',
                marginBottom: '10px',
                transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseOut={(e) => e.target.style.color = '#666'}
        >
            ← Back
        </button>
    );
};

export default BackButton;
