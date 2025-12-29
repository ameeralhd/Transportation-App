import React, { useState } from 'react';
import api from '../api';

const CheckIn = () => {
    const [bookingId, setBookingId] = useState('');
    const [contact, setContact] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCheckIn = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        try {
            const res = await api.post('/bookings/checkin', { bookingId, contact });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Check-in failed');
        }
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2 className="section-title">Online Check-in</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                Enter your booking details to check in and get your seat assignment.
            </p>

            <form onSubmit={handleCheckIn} className="card" style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Booking ID</label>
                    <input
                        type="text"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="e.g. 12"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Details (Phone/Email)</label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Must match booking"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>
                <button type="submit" className="primary" style={{ width: '100%', padding: '12px' }}>Check In Now</button>
            </form>

            {error && <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}

            {result && (
                <div className="card animate-fade-in" style={{ marginTop: '20px', padding: '30px', background: '#e8f5e9', border: '1px solid #c8e6c9', textAlign: 'center' }}>
                    <h3 style={{ color: '#2e7d32', marginTop: 0 }}>{result.message}</h3>
                    <div style={{ fontSize: '1.2rem', margin: '15px 0' }}>
                        Your Seat: <strong>{result.seat}</strong>
                    </div>
                    <p style={{ color: '#555' }}>Please show this screen to the driver upon boarding.</p>
                </div>
            )}
        </div>
    );
};

export default CheckIn;
