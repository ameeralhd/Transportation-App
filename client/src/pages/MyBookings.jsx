import React, { useState, useEffect } from 'react';
import api from '../api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [rentalBookings, setRentalBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const [resBookings, resRentals] = await Promise.all([
                api.get('/bookings/my'),
                api.get('/rentals/bookings/my')
            ]);
            setBookings(resBookings.data);
            setRentalBookings(resRentals.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        try {
            if (selectedBooking.type === 'rental') {
                await api.post(`/rentals/bookings/${selectedBooking.id}/cancel`);
            } else {
                await api.post(`/bookings/${selectedBooking.id}/cancel`, { reason: cancelReason });
            }

            alert('Booking Cancelled');
            setSelectedBooking(null);
            setCancelReason('');
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Cancellation failed');
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="section-title">My Trip History</h2>
            {bookings.length === 0 ? <p className="glass" style={{ padding: '20px' }}>No bookings found. Start your journey today!</p> : (
                <div style={{ display: 'grid', gap: '30px' }}>

                    {/* Transport Bookings */}
                    {bookings.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: '15px', borderBottom: '2px solid var(--secondary-color)', display: 'inline-block' }}>Bus/Train Tickets</h3>
                            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                {bookings.map(b => (
                                    <div key={b.id} className="card" style={{
                                        borderLeft: `4px solid ${b.status === 'cancelled' ? 'red' : 'var(--secondary-color)'}`,
                                        opacity: b.status === 'cancelled' ? 0.7 : 1
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3>{b.source} ➝ {b.destination}</h3>
                                            {b.status === 'cancelled' && <span style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>CANCELLED</span>}
                                        </div>
                                        <p>📅 {new Date(b.departureTime).toLocaleDateString()} • ⏰ {new Date(b.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Trip ID: {b.id}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Rp {b.price.toLocaleString()}</span>
                                            <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>Booked: {new Date(b.bookingDate).toLocaleDateString()}</span>
                                        </div>

                                        {b.status !== 'cancelled' && (
                                            <button className="light" style={{ width: '100%', marginTop: '15px', color: '#d32f2f', border: '1px solid #d32f2f' }} onClick={() => setSelectedBooking({ type: 'transport', ...b })}>
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rental Bookings */}
                    {rentalBookings.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: '15px', borderBottom: '2px solid orange', display: 'inline-block' }}>Car Rentals</h3>
                            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                {rentalBookings.map(r => (
                                    <div key={r.id} className="card" style={{
                                        borderLeft: `4px solid ${r.status === 'cancelled' ? 'red' : 'orange'}`,
                                        opacity: r.status === 'cancelled' ? 0.7 : 1
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3>{r.name}</h3>
                                            {r.status === 'cancelled' && <span style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>CANCELLED</span>}
                                        </div>
                                        <p style={{ fontSize: '0.9rem' }}>{r.city}</p>
                                        <div style={{ height: '100px', overflow: 'hidden', borderRadius: '8px', margin: '10px 0' }}>
                                            <img src={r.image_url} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <p>📅 Pick-up: {new Date(r.startDate).toLocaleDateString()}</p>
                                        <p>📅 Drop-off: {new Date(r.endDate).toLocaleDateString()}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Rp {r.totalPrice.toLocaleString()}</span>
                                            <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>Booked: {new Date(r.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {r.status !== 'cancelled' && (
                                            <button className="light" style={{ width: '100%', marginTop: '15px', color: '#d32f2f', border: '1px solid #d32f2f' }} onClick={() => setSelectedBooking({ type: 'rental', ...r })}>
                                                Cancel Rental
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Refund Modal */}
            {selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="card animate-fade-in" style={{ width: '400px', padding: '30px' }}>
                        <h3>Cancel {selectedBooking.type === 'rental' ? 'Rental' : 'Booking'}?</h3>
                        <p>Are you sure you want to cancel your {selectedBooking.type === 'rental' ? 'car rental' : 'trip'}?</p>

                        <form onSubmit={handleCancel}>
                            <label style={{ display: 'block', marginBottom: '10px' }}>Reason for cancellation:</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                style={{ width: '100%', height: '80px', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px' }}
                                required
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="light" onClick={() => setSelectedBooking(null)}>Keep Trip</button>
                                <button type="submit" className="primary" style={{ background: '#d32f2f', border: 'none' }}>Confirm Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
