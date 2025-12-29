import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [error, setError] = useState('');
    const [contact, setContact] = useState({ name: '', phone: '', email: '' });

    // Pre-fill user data if available
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setContact({ name: user.full_name || '', phone: user.phone || '', email: user.email || '' });
        }
    }, []);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await api.get(`/hotels/${id}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Failed to fetch hotel", err);
                setError("Hotel not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    const handleBook = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to book a hotel.");
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates.");
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights < 1) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        const totalPrice = nights * hotel.price_per_night;

        try {
            await api.post('/bookings/hotel', {
                userId: user.id,
                hotelId: hotel.id,
                checkIn,
                checkOut,
                guests,
                contactDetails: contact,
                totalPrice
            });
            alert("Booking Successful!");
            navigate('/my-bookings'); // Redirect to bookings page (will need to update it to show hotels)
        } catch (err) {
            console.error("Booking failed", err);
            alert("Booking failed. Please try again.");
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
    if (!hotel) return null;

    return (
        <div className="animate-fade-in">
            <div style={{
                height: '400px',
                background: `url(${hotel.image_url}) center/cover`,
                position: 'relative',
                marginBottom: '40px'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'flex-end'
                }}>
                    <div className="container" style={{ color: 'white', paddingBottom: '40px' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{hotel.name}</h1>
                        <p style={{ fontSize: '1.2rem' }}>📍 {hotel.city} • {hotel.address}</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginBottom: '50px' }}>
                {/* Left Column: Details */}
                <div>
                    <div className="card" style={{ padding: '30px', marginBottom: '30px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <h2 className="section-title">About this property</h2>
                        <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                            Experience luxury and comfort at {hotel.name}. Located in the heart of {hotel.city},
                            this property offers world-class amenities and breathtaking views. Perfect for both business and leisure travelers.
                        </p>
                        <h3 style={{ marginBottom: '15px' }}>Amenities</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {hotel.amenities.split(',').map((amenity, index) => (
                                <span key={index} style={{
                                    background: '#f0f4f8', color: 'var(--primary-color)',
                                    padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem'
                                }}>
                                    ✨ {amenity.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '30px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <h2 className="section-title">Location</h2>
                        {/* Static Map Image (Placeholder for real map if needed) */}
                        <div style={{ height: '300px', background: '#eee', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Form */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '20px', padding: '30px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        Rp {hotel.price_per_night.toLocaleString()}
                                    </span>
                                    <span style={{ color: '#666' }}> / night</span>
                                </div>
                                <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                                    ★ {hotel.rating}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBook}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>CHECK-IN</label>
                                    <input
                                        type="date"
                                        required
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px 0 0 8px' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>CHECK-OUT</label>
                                    <input
                                        type="date"
                                        required
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '0 8px 8px 0', borderLeft: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>GUESTS</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>

                            <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase', color: '#888' }}>Contact Information</h4>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={contact.name}
                                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        required
                                        value={contact.phone}
                                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>

                            {checkIn && checkOut && (
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px 0', color: '#666' }}>Rp {hotel.price_per_night.toLocaleString()} x {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>Rp {(Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) * hotel.price_per_night).toLocaleString()}</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px 0', color: '#666' }}>Service fee (5%)</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>Rp {Math.floor((Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) * hotel.price_per_night) * 0.05).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '15px 0 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Total</td>
                                                <td style={{ padding: '15px 0 0 0', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                                    Rp {(Math.floor((Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) * hotel.price_per_night) * 1.05)).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <button type="submit" className="primary" style={{
                                width: '100%',
                                padding: '15px',
                                fontSize: '1.1rem',
                                borderRadius: '30px',
                                background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                                boxShadow: '0 5px 15px rgba(26, 188, 156, 0.3)',
                                transition: 'transform 0.2s',
                                border: 'none'
                            }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            >
                                Reserve Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
