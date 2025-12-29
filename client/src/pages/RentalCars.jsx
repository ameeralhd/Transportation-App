import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const RentalCars = () => {
    const [cars, setCars] = useState([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async (cityName = '') => {
        setLoading(true);
        try {
            const url = cityName ? `/rentals?city=${cityName}` : '/rentals';
            const res = await api.get(url);
            setCars(res.data);
        } catch (err) {
            console.error('Failed to fetch cars', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCars(city);
        const resultsEl = document.getElementById('car-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    };

    // Featured cars (e.g., SUVs or just first few)
    const featuredCars = cars.slice(0, 3);

    const trendingDestinations = [
        { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { name: 'Jakarta', image: 'https://images.unsplash.com/photo-1555899434-94d1368d7eaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { name: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448c4a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { name: 'Bandung', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div style={{
                height: '400px',
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80) center/cover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                marginBottom: '40px'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '15px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Rent a Car for Your Journey</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '30px' }}>Hit the road with comfort. Choose from our wide range of vehicles.</p>

                {/* Floating Search Bar */}
                <form onSubmit={handleSearch} style={{
                    background: 'white',
                    padding: '10px',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    maxWidth: '800px',
                    width: '90%'
                }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid #ddd' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>📍</span>
                        <input
                            type="text"
                            placeholder="Pick-up City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid #ddd' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>📅</span>
                        <input type="date" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }} />
                    </div>
                    <button type="submit" className="primary" style={{
                        borderRadius: '30px',
                        padding: '15px 30px',
                        fontSize: '1.1rem',
                        marginRight: '5px'
                    }}>
                        Search
                    </button>
                </form>
            </div>

            <div className="container">
                {/* Featured / Recommended - Only show if cars are loaded */}
                {!city && cars.length > 0 && (
                    <div style={{ marginBottom: '50px' }}>
                        <h2 className="section-title">Recommended Vehicles</h2>
                        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {featuredCars.map(car => (
                                <div key={car.id} className="card" style={{ cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                    <div style={{ height: '220px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', top: 10, right: 10,
                                            background: 'white', padding: '5px 10px', borderRadius: '15px',
                                            fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--secondary-color)',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                        }}>
                                            {car.type}
                                        </div>
                                        <button
                                            style={{
                                                position: 'absolute', top: 10, left: 10,
                                                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                                                borderRadius: '50%', width: '32px', height: '32px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                            }}
                                            onClick={(e) => { e.stopPropagation(); alert('Added to favorites!'); }}
                                        >
                                            ♥
                                        </button>
                                        <div style={{ width: '100%', height: '100%', background: `url(${car.image_url}) center/cover` }}></div>
                                    </div>
                                    <div className="card-content">
                                        <h3 style={{ marginBottom: '5px' }}>{car.name}</h3>
                                        <p style={{ color: '#666', fontSize: '0.9rem' }}>📍 {car.city}</p>
                                        <div style={{ marginTop: '15px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                            Rp {car.price_per_day.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>/day</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Destinations */}
                {!city && (
                    <div style={{ marginBottom: '50px' }}>
                        <h2 className="section-title">Popular Car Rental Hubs</h2>
                        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            {trendingDestinations.map((dest, index) => (
                                <div key={index} className="card" onClick={() => setCity(dest.name)} style={{ cursor: 'pointer', border: 'none', position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(${dest.image}) center/cover`
                                    }}></div>
                                    <div style={{ position: 'absolute', bottom: 15, left: 15, color: 'white' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dest.name}</h3>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Best Deals</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div id="car-results">
                    {city && <h2 className="section-title">Available Cars in "{city}"</h2>}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚗</div>
                            Finding best options...
                        </div>
                    ) : (
                        <div className="card-grid">
                            {cars.map(car => (
                                <div key={car.id} className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                                    <div style={{ width: '300px', background: `url(${car.image_url}) center/cover`, minHeight: '200px' }}></div>
                                    <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{car.name}</h3>
                                                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 10px 0' }}>📍 {car.city}</p>
                                            </div>
                                            <div style={{ background: '#fff3e0', color: '#e65100', padding: '5px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                {car.type}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>Capacity: {car.seats} Seats | Manual/Auto</p>
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                            <div>
                                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Daily Rate</span>
                                                <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>Rp {car.price_per_day.toLocaleString()}</h3>
                                            </div>
                                            <button className="primary" style={{ borderRadius: '25px', padding: '10px 25px' }} onClick={() => navigate('/rentals/' + car.id)}>Rent Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {cars.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <h3>No cars found for "{city}"</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>Try searching searching for other popular hubs.</p>
                            <button className="light" onClick={() => setCity('')}>View All Cars</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalCars;
