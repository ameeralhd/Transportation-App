import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        full_name: '',
        username: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const res = await register(form);
        if (res.success) {
            alert('Registration successful! Please login.');
            navigate('/login');
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

    return (
        <div style={{ maxWidth: '450px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }} className="animate-fade-in">
            {/* Registration Card */}
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1abc9c, #16a085)',
                    color: 'white',
                    padding: '30px 20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👤+</div>
                    <h2 style={{ margin: 0 }}>Register New Account</h2>
                    <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Join TransGo for easy booking</p>
                </div>

                {/* Form */}
                <div style={{ padding: '30px' }}>
                    {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Full name *</label>
                        <input style={inputStyle} placeholder="Your full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />

                        <label style={labelStyle}>Email *</label>
                        <input style={inputStyle} type="email" placeholder="name@email.com" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '-10px', marginBottom: '15px' }}>Email will be used for booking notification</div>

                        <label style={labelStyle}>Phone number *</label>
                        <input style={inputStyle} placeholder="08123456789" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />

                        <label style={labelStyle}>Password *</label>
                        <input style={inputStyle} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

                        <label style={labelStyle}>Confirm Password *</label>
                        <input style={inputStyle} type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />

                        <div style={{ margin: '15px 0' }}>
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>I agree to <a href="#" style={{ color: '#3498db' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#3498db' }}>Privacy Policy</a></label>
                        </div>

                        <button type="submit" style={{
                            width: '100%',
                            padding: '12px',
                            background: '#2980b9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            👤+ Register Now
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: '#2980b9', fontWeight: 'bold', textDecoration: 'none' }}>Log in here→</Link>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div style={{
                marginTop: '20px',
                background: '#2980b9',
                color: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>🎁 Benefits of Registering</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li>✅ Faster booking with saved data</li>
                    <li>✅ Travel history is automatically saved</li>
                    <li>✅ Email notification for every booking</li>
                    <li>✅ Access exclusive promotions and discounts</li>
                </ul>
            </div>
        </div>
    );
};

export default Register;
