import React, { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('schedules');
    const [activeApprovalTab, setActiveApprovalTab] = useState('transport');
    const [items, setItems] = useState([]);
    const [approvals, setApprovals] = useState([]);

    // Forms state
    const [scheduleForm, setScheduleForm] = useState({ source: '', destination: '', departureTime: '', price: '', availableSeats: '' });
    const [hotelForm, setHotelForm] = useState({ name: '', city: '', address: '', price_per_night: '', rating: '', image_url: '', amenities: '', latitude: '', longitude: '' });
    const [rentalForm, setRentalForm] = useState({ name: '', city: '', type: '', price_per_day: '', seats: '', image_url: '', latitude: '', longitude: '' });

    useEffect(() => {
        if (activeTab === 'approvals') {
            fetchApprovals();
        } else {
            fetchData();
        }
    }, [activeTab, activeApprovalTab]);

    const fetchData = async () => {
        try {
            let res;
            if (activeTab === 'schedules') res = await api.get('/schedules');
            else if (activeTab === 'hotels') res = await api.get('/hotels');
            else if (activeTab === 'rentals') res = await api.get('/rentals');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchApprovals = async () => {
        try {
            let res;
            if (activeApprovalTab === 'transport') res = await api.get('/bookings/pending');
            else if (activeApprovalTab === 'hotels') res = await api.get('/hotel-bookings/pending');
            else if (activeApprovalTab === 'users') res = await api.get('/auth/users');
            setApprovals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprovalAction = async (id, action, type) => {
        try {
            const endpoint = type === 'transport' ? `/bookings/${id}/${action}` : `/hotel-bookings/${id}/${action}`;
            await api.post(endpoint, { reason: 'Admin Action' });
            fetchApprovals();
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this item?')) {
            try {
                if (activeTab === 'schedules') await api.delete(`/schedules/${id}`);
                else if (activeTab === 'hotels') await api.delete(`/hotels/${id}`);
                else if (activeTab === 'rentals') await api.delete(`/rentals/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'schedules') {
                await api.post('/schedules', scheduleForm);
                setScheduleForm({ source: '', destination: '', departureTime: '', price: '', availableSeats: '' });
            } else if (activeTab === 'hotels') {
                await api.post('/hotels', hotelForm);
                setHotelForm({ name: '', city: '', address: '', price_per_night: '', rating: '', image_url: '', amenities: '', latitude: '', longitude: '' });
            } else if (activeTab === 'rentals') {
                await api.post('/rentals', rentalForm);
                setRentalForm({ name: '', city: '', type: '', price_per_day: '', seats: '', image_url: '', latitude: '', longitude: '' });
            }
            fetchData();
        } catch (err) {
            alert('Failed to create');
        }
    };

    // Shared Styles
    const tabStyle = (tab, current) => ({
        padding: '12px 24px',
        cursor: 'pointer',
        borderBottom: current === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
        fontWeight: current === tab ? 'bold' : 'normal',
        color: current === tab ? 'var(--primary-color)' : '#666',
        background: 'transparent',
        border: 'none',
        fontSize: '1rem',
        transition: 'all 0.3s'
    });

    const formGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        alignItems: 'end',
        background: 'rgba(255,255,255,0.8)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginTop: '5px'
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '50px' }}>
            <h2 style={{ marginBottom: '30px' }}>Admin Dashboard</h2>

            {/* Main Tabs */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '30px', borderBottom: '1px solid #eee' }}>
                <button style={tabStyle('schedules', activeTab)} onClick={() => setActiveTab('schedules')}>Transport</button>
                <button style={tabStyle('hotels', activeTab)} onClick={() => setActiveTab('hotels')}>Hotels</button>
                <button style={tabStyle('rentals', activeTab)} onClick={() => setActiveTab('rentals')}>Rental Cars</button>
                <button style={tabStyle('approvals', activeTab)} onClick={() => setActiveTab('approvals')}>Approvals Center ✨</button>
            </div>

            {activeTab === 'approvals' ? (
                <div className="approvals-section">
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        <button
                            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: activeApprovalTab === 'transport' ? 'var(--primary-color)' : 'white', color: activeApprovalTab === 'transport' ? 'white' : '#666', cursor: 'pointer' }}
                            onClick={() => setActiveApprovalTab('transport')}
                        >
                            Transport Bookings
                        </button>
                        <button
                            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: activeApprovalTab === 'hotels' ? 'var(--primary-color)' : 'white', color: activeApprovalTab === 'hotels' ? 'white' : '#666', cursor: 'pointer' }}
                            onClick={() => setActiveApprovalTab('hotels')}
                        >
                            Hotel Reservations
                        </button>
                        <button
                            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: activeApprovalTab === 'users' ? 'var(--primary-color)' : 'white', color: activeApprovalTab === 'users' ? 'white' : '#666', cursor: 'pointer' }}
                            onClick={() => setActiveApprovalTab('users')}
                        >
                            User Registry
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {approvals.map(item => (
                            <div key={item.id} className="glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    {activeApprovalTab === 'transport' && (
                                        <>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.source} ➝ {item.destination}</div>
                                            <div style={{ opacity: 0.8 }}>Passenger: <strong>{item.username}</strong> ({item.passengers} seats)</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Booked on: {new Date(item.bookingDate).toLocaleDateString()}</div>
                                        </>
                                    )}
                                    {activeApprovalTab === 'hotels' && (
                                        <>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.hotel_name}</div>
                                            <div style={{ opacity: 0.8 }}>Guest: <strong>{item.username}</strong> | Guests: {item.guests}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.checkIn} to {item.checkOut}</div>
                                        </>
                                    )}
                                    {activeApprovalTab === 'users' && (
                                        <>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.full_name || 'No Name'}</div>
                                            <div style={{ opacity: 0.8 }}>Username: <strong>{item.username}</strong> | Role: {item.role}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Phone: {item.phone || 'N/A'}</div>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {activeApprovalTab !== 'users' ? (
                                        <>
                                            <button
                                                onClick={() => handleApprovalAction(item.id, 'approve', activeApprovalTab)}
                                                className="primary"
                                                style={{ padding: '10px 20px', borderRadius: '30px' }}
                                            >
                                                ✓ Confirm
                                            </button>
                                            <button
                                                onClick={() => handleApprovalAction(item.id, 'reject', activeApprovalTab)}
                                                className="danger"
                                                style={{ padding: '10px 20px', borderRadius: '30px', background: '#e74c3c' }}
                                            >
                                                ✕ Reject
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>REGISTERED</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {approvals.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '15px', color: '#888' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                                <div>No pending requests. Everything is up to date!</div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Create Forms */}
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--secondary-color)' }}>
                            Add New {activeTab === 'schedules' ? 'Schedule' : activeTab === 'hotels' ? 'Hotel' : 'Rental Car'}
                        </h3>

                        <form onSubmit={handleCreate} style={formGridStyle}>
                            {activeTab === 'schedules' && (
                                <>
                                    <label>From <input style={inputStyle} value={scheduleForm.source} onChange={e => setScheduleForm({ ...scheduleForm, source: e.target.value })} placeholder="City" required /></label>
                                    <label>To <input style={inputStyle} value={scheduleForm.destination} onChange={e => setScheduleForm({ ...scheduleForm, destination: e.target.value })} placeholder="City" required /></label>
                                    <label>Date/Time <input type="datetime-local" style={inputStyle} value={scheduleForm.departureTime} onChange={e => setScheduleForm({ ...scheduleForm, departureTime: e.target.value })} required /></label>
                                    <label>Price ($) <input type="number" style={inputStyle} value={scheduleForm.price} onChange={e => setScheduleForm({ ...scheduleForm, price: e.target.value })} placeholder="0.00" required /></label>
                                    <label>Seats <input type="number" style={inputStyle} value={scheduleForm.availableSeats} onChange={e => setScheduleForm({ ...scheduleForm, availableSeats: e.target.value })} placeholder="Available" required /></label>
                                </>
                            )}

                            {activeTab === 'hotels' && (
                                <>
                                    <label>Name <input style={inputStyle} value={hotelForm.name} onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })} placeholder="Hotel Name" required /></label>
                                    <label>City <input style={inputStyle} value={hotelForm.city} onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })} placeholder="City" required /></label>
                                    <label>Address <input style={inputStyle} value={hotelForm.address} onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })} placeholder="Full Address" required /></label>
                                    <label>Price/Night (Rp) <input type="number" style={inputStyle} value={hotelForm.price_per_night} onChange={e => setHotelForm({ ...hotelForm, price_per_night: e.target.value })} required /></label>
                                    <label>Rating <input type="number" step="0.1" max="5" style={inputStyle} value={hotelForm.rating} onChange={e => setHotelForm({ ...hotelForm, rating: e.target.value })} placeholder="4.5" /></label>
                                    <label style={{ gridColumn: 'span 2' }}>Image URL <input style={inputStyle} value={hotelForm.image_url} onChange={e => setHotelForm({ ...hotelForm, image_url: e.target.value })} placeholder="https://..." /></label>
                                    <label style={{ gridColumn: 'span 2' }}>Amenities <input style={inputStyle} value={hotelForm.amenities} onChange={e => setHotelForm({ ...hotelForm, amenities: e.target.value })} placeholder="Pool, WiFi, Gym" /></label>
                                    <label>Lat <input type="number" step="any" style={inputStyle} value={hotelForm.latitude} onChange={e => setHotelForm({ ...hotelForm, latitude: e.target.value })} placeholder="-6.200" /></label>
                                    <label>Long <input type="number" step="any" style={inputStyle} value={hotelForm.longitude} onChange={e => setHotelForm({ ...hotelForm, longitude: e.target.value })} placeholder="106.800" /></label>
                                </>
                            )}

                            {activeTab === 'rentals' && (
                                <>
                                    <label>Name <input style={inputStyle} value={rentalForm.name} onChange={e => setRentalForm({ ...rentalForm, name: e.target.value })} placeholder="Car Model" required /></label>
                                    <label>City <input style={inputStyle} value={rentalForm.city} onChange={e => setRentalForm({ ...rentalForm, city: e.target.value })} placeholder="City" required /></label>
                                    <label>Type <input style={inputStyle} value={rentalForm.type} onChange={e => setRentalForm({ ...rentalForm, type: e.target.value })} placeholder="SUV, MPV..." required /></label>
                                    <label>Price/Day (Rp) <input type="number" style={inputStyle} value={rentalForm.price_per_day} onChange={e => setRentalForm({ ...rentalForm, price_per_day: e.target.value })} required /></label>
                                    <label>Seats <input type="number" style={inputStyle} value={rentalForm.seats} onChange={e => setRentalForm({ ...rentalForm, seats: e.target.value })} required /></label>
                                    <label style={{ gridColumn: 'span 2' }}>Image URL <input style={inputStyle} value={rentalForm.image_url} onChange={e => setRentalForm({ ...rentalForm, image_url: e.target.value })} placeholder="https://..." /></label>
                                    <label>Lat <input type="number" step="any" style={inputStyle} value={rentalForm.latitude} onChange={e => setRentalForm({ ...rentalForm, latitude: e.target.value })} placeholder="-6.200" /></label>
                                    <label>Long <input type="number" step="any" style={inputStyle} value={rentalForm.longitude} onChange={e => setRentalForm({ ...rentalForm, longitude: e.target.value })} placeholder="106.800" /></label>
                                </>
                            )}

                            <button type="submit" className="primary" style={{ height: '45px', borderRadius: '8px' }}>
                                + Add Item
                            </button>
                        </form>
                    </div>

                    {/* List View */}
                    <h3>Manage Items</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {items.map(item => (
                            <div key={item.id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary-color)' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    {(activeTab === 'hotels' || activeTab === 'rentals') && item.image_url && (
                                        <img src={item.image_url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    )}
                                    <div>
                                        <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                                            {activeTab === 'schedules' ? `${item.source} ➝ ${item.destination}` : item.name}
                                        </div>
                                        <div style={{ opacity: 0.7, fontSize: '0.9em' }}>
                                            {activeTab === 'schedules' ? new Date(item.departureTime).toLocaleString() : item.city}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <button onClick={() => handleDelete(item.id)} className="danger" style={{ padding: '8px 15px', borderRadius: '20px', fontSize: '0.9em' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
