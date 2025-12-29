import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth(); // login function updates user context
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            const res = await api.put('/auth/profile', {
                full_name: formData.full_name,
                phone: formData.phone,
                password: formData.password || undefined // Only send if set
            });
            setMessage('Profile updated successfully!');
            // Update local user context with new data/token if needed, 
            // but simplified here we just update user object if context supports it.
            // Assuming context re-fetches or we inform it. 
            // For now, simple alert.
            // Ideally: login(res.data.user, token) but we don't have token in response here necessarily or we didn't change it.
            // Just reloading page or re-fetching user would be robust.
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2 className="section-title">User Profile</h2>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 15px auto' }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <h3 style={{ margin: 0 }}>@{user?.username}</h3>
                    <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{user?.role}</span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Leave blank to keep current password</p>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>New Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>

                <button type="submit" className="primary" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Saving...' : 'Update Profile'}
                </button>
                {message && <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            </form>
        </div>
    );
};

export default Profile;
