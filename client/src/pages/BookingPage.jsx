
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { schedule } = location.state || {}; // Get schedule passed from Home

    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [passengers, setPassengers] = useState(1);

    // Detailed Passenger Information
    const [passengerDetails, setPassengerDetails] = useState({
        name: '',
        contact: '', // kept as 'contact' to match user request "contact, email, phone" redundancy or just general contact
        email: '',
        phone: ''
    });

    // Emergency Contact Information
    const [emergencyContact, setEmergencyContact] = useState({
        name: '',
        contact: '',
        email: '',
        phone: ''
    });

    const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!schedule) {
        return <div className="container" style={{ marginTop: '40px' }}>No schedule selected. Please go back to home.</div>;
    }

    const totalPrice = schedule.price * passengers;

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentChange = (e) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock Payment Validation
        if (payment.cardNumber.length < 16 || payment.cvv.length < 3) {
            setError('Invalid payment details. Please check your card info.');
            setLoading(false);
            return;
        }

        try {
            // Combine details into a single JSON object for storage
            const fullContactDetails = JSON.stringify({
                passenger: passengerDetails,
                emergency: emergencyContact
            });

            await api.post('/bookings', {
                scheduleId: schedule.id,
                passengers,
                contact_details: fullContactDetails
            });
            alert('Booking Successful! Enjoy your trip.');
            navigate('/bookings');
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2 className="section-title">Complete your Booking</h2>

            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Trip Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>From</span>
                        <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{schedule.source}</p>
                    </div>
                    <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>To</span>
                        <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{schedule.destination}</p>
                    </div>
                    <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Date</span>
                        <p style={{ margin: '5px 0' }}>{new Date(schedule.departureTime).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>Time</span>
                        <p style={{ margin: '5px 0' }}>{new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleBook} className="card" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Number of Passengers</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                {/* Passenger Information */}
                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Passenger Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={passengerDetails.name}
                            onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contact/Phone 2</label>
                        <input
                            type="text"
                            value={passengerDetails.contact}
                            onChange={(e) => setPassengerDetails({ ...passengerDetails, contact: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={passengerDetails.email}
                            onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={passengerDetails.phone}
                            onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                </div>

                {/* Emergency Contact Information */}
                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', marginTop: '30px' }}>Emergency Contact</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contact Name</label>
                        <input
                            type="text"
                            value={emergencyContact.name}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contact/Phone 2</label>
                        <input
                            type="text"
                            value={emergencyContact.contact}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, contact: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={emergencyContact.email}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, email: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={emergencyContact.phone}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ color: '#666' }}>Total Price</span>
                        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Rp {(schedule.price * passengers).toLocaleString()}</h2>
                    </div>
                    <button type="submit" className="primary" disabled={loading} style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                        {loading ? 'Processing...' : 'Confirm & Pay'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;
