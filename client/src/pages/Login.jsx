import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isAdmin && form.username !== 'admin') {
            setError('Invalid Admin Username');
            return;
        }

        const res = await login(form.username, form.password);
        if (res.success) {
            if (isAdmin && res.role !== 'admin') {
                setError('This account does not have admin privileges.');
                return;
            }
            navigate(isAdmin ? '/admin' : '/');
        } else {
            setError(res.error);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#444'
    };

    const toggleButtonStyle = (active) => ({
        flex: 1,
        padding: '10px',
        border: 'none',
        background: active ? '#2980b9' : '#ecf0f1',
        color: active ? 'white' : '#7f8c8d',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'all 0.3s ease'
    });

    return (
        <div style={{ maxWidth: '450px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }} className="animate-fade-in">
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1abc9c, #16a085)',
                    color: 'white',
                    padding: '30px 20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
                    <h2 style={{ margin: 0 }}>{isAdmin ? 'Admin Portal' : 'Login to Account'}</h2>
                    <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Welcome back to TransBo</p>
                </div>

                <div style={{ padding: '30px' }}>
                    {/* Role Toggle */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: '#f8f9fa', padding: '5px', borderRadius: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setIsAdmin(false)}
                            style={toggleButtonStyle(!isAdmin)}
                        >
                            👤 User
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdmin(true)}
                            style={toggleButtonStyle(isAdmin)}
                        >
                            🛡️ Admin
                        </button>
                    </div>

                    {error && <div style={{ color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Username / Email</label>
                        <input
                            style={inputStyle}
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            required
                        />

                        <label style={labelStyle}>Password</label>
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />

                        <button type="submit" style={{
                            width: '100%',
                            padding: '12px',
                            background: '#2980b9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}>
                            {isAdmin ? '🔓 Access Dashboard' : '🚀 Start Journey'}
                        </button>
                    </form>

                    {!isAdmin && (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                            Don't have an account? <Link to="/register" style={{ color: '#2980b9', fontWeight: 'bold', textDecoration: 'none' }}>Register New→ </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
