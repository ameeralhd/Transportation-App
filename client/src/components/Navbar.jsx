import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TransportBooking</Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                    <Link to="/blog" style={{ marginRight: '10px' }}>Blog</Link>
                    <Link to="/checkin" style={{ marginRight: '10px' }}>Check-in</Link>
                    {user && user.role === 'admin' && <Link to="/stats" style={{ marginRight: '10px' }}>Data</Link>}

                    {!user && (
                        <>
                            <button className="light" onClick={() => navigate('/register')} style={{ marginRight: '10px' }}>Register</button>
                            <button className="light" onClick={() => navigate('/login')}>Sign in</button>
                        </>
                    )}

                    {user && (
                        <>
                            {user.role === 'admin' && <Link to="/admin" style={{ marginRight: '10px' }}>Dashboard</Link>}
                            {user.role === 'user' && <Link to="/bookings" style={{ marginRight: '10px' }}>My Trips</Link>}
                            <Link to="/profile" style={{ marginLeft: '10px', fontWeight: 'bold' }}>{user.username}</Link>
                            <button onClick={handleLogout} style={{ marginLeft: '10px', background: 'transparent', border: '1px solid white', color: 'white' }}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
