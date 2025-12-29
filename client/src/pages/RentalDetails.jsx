import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const RentalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [contact, setContact] = useState({ name: '', phone: '', email: '' });
    const [license, setLicense] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setContact({ name: user.full_name || '', phone: user.phone || '', email: user.email || '' });
        }
    }, []);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/rentals/${id}`);
                setCar(res.data);
            } catch (err) {
                console.error("Failed to fetch car", err);
                setError("Car not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleBook = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to rent a car.");
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select dates.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (days < 1) {
            alert("End date must be after start date.");
            return;
        }

        const totalPrice = days * car.price_per_day;

        try {
            await api.post('/rentals/book', {
                carId: car.id,
                startDate,
                endDate,
                totalPrice,
                contact_details: JSON.stringify(contact),
                driver_license: license
            });

            alert(`Rental Request Sent Successfully!\n\nCar: ${car.name}\nTotal: Rp ${totalPrice.toLocaleString()}\n\nCheck 'My Bookings' for details.`);
            navigate('/bookings');
        } catch (err) {
            console.error("Booking failed", err);
            alert(err.response?.data?.error || "Failed to book rental car.");
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
    if (!car) return null;

    return (
        <div className="animate-fade-in">
            <div style={{
                height: '400px',
                background: `url(${car.image_url}) center/cover`,
                position: 'relative',
                marginBottom: '40px'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'flex-end'
                }}>
                    <div className="container" style={{ color: 'white', paddingBottom: '40px' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{car.name}</h1>
                        <p style={{ fontSize: '1.2rem' }}>📍 {car.city} • {car.type}</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginBottom: '50px' }}>
                <div>
                    <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
                        <h2 className="section-title">Vehicle Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                            <div>
                                <strong style={{ color: '#666' }}>Type</strong>
                                <p style={{ fontSize: '1.2rem' }}>{car.type}</p>
                            </div>
                            <div>
                                <strong style={{ color: '#666' }}>Capacity</strong>
                                <p style={{ fontSize: '1.2rem' }}>{car.seats} Passengers</p>
                            </div>
                            <div>
                                <strong style={{ color: '#666' }}>Transmission</strong>
                                <p style={{ fontSize: '1.2rem' }}>Automatic</p>
                            </div>
                            <div>
                                <strong style={{ color: '#666' }}>Daily Rate</strong>
                                <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>Rp {car.price_per_day.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '20px', padding: '30px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        Rp {car.price_per_day.toLocaleString()}
                                    </span>
                                    <span style={{ color: '#666' }}> / day</span>
                                </div>
                                <div style={{ background: '#fff3e0', color: '#e65100', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                                    {car.type}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBook}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>PICK-UP</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px 0 0 8px' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>DROP-OFF</label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '0 8px 8px 0', borderLeft: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase', color: '#888' }}>Driver Information</h4>
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
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Driver's License ID (SIM)"
                                        required
                                        value={license}
                                        onChange={(e) => setLicense(e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>

                            {startDate && endDate && (
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px 0', color: '#666' }}>Rp {car.price_per_day.toLocaleString()} x {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>Rp {(Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * car.price_per_day).toLocaleString()}</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px 0', color: '#666' }}>Insurance & Fees (10%)</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>Rp {Math.floor((Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * car.price_per_day) * 0.10).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '15px 0 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Total</td>
                                                <td style={{ padding: '15px 0 0 0', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                                    Rp {(Math.floor((Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * car.price_per_day) * 1.10)).toLocaleString()}
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
                                Confirm Rental
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalDetails;
