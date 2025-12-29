import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [schedules, setSchedules] = useState([]);
    const [filters, setFilters] = useState({ source: '', destination: '', date: '' });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const resultsRef = useRef(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/schedules?${params}`);
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams(filters).toString();
        navigate(`/search?${params}`);
    };

    const handleBook = (schedule) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/book', { state: { schedule } });
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="container hero-content">
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Find your next journey</h1>
                    <p style={{ fontSize: '1.5rem', margin: '0 0 30px 0' }}>Search low prices on bus tickets, shuttles, and more...</p>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button style={{
                            background: 'white',
                            color: 'var(--primary-color)',
                            borderRadius: '30px',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid white'
                        }}>
                            <span>🚌</span> Bus
                        </button>
                        <button
                            onClick={() => navigate('/hotels')}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                cursor: 'pointer'
                            }}>
                            <span>🏨</span> Hotels
                        </button>
                        <button
                            onClick={() => navigate('/rentals')}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                cursor: 'pointer'
                            }}>
                            <span>🚗</span> Car Rental
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Search Bar */}
                <div className="search-box">
                    <div className="search-inner">
                        <div className="search-input-group">
                            <span style={{ marginRight: '10px' }}>🚌</span>
                            <input
                                name="source"
                                placeholder="From where?"
                                value={filters.source}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="search-input-group">
                            <span style={{ marginRight: '10px' }}>📍</span>
                            <input
                                name="destination"
                                placeholder="To where?"
                                value={filters.destination}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="search-input-group">
                            <span style={{ marginRight: '10px' }}>📅</span>
                            <input
                                name="date"
                                type="date"
                                value={filters.date}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="accent" onClick={handleSearch} style={{ height: '100%' }}>Search</button>
                    </div>
                </div>

                {/* Offers Section */}
                <div style={{ marginTop: '80px', marginBottom: '40px' }}>
                    <h2 className="section-title">Offers</h2>
                    <p style={{ marginBottom: '20px', color: '#666' }}>Promotions, deals, and special offers for you</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                            <div style={{ padding: '20px', flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>Save 15% on Late Night Trips</h3>
                                <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Book your night buses now and travel comfortably while saving money.</p>
                                <button className="primary">Find a bus</button>
                            </div>
                            <div style={{
                                width: '150px',
                                height: '100%',
                                background: 'url(https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80) center/cover',
                                minHeight: '180px'
                            }}></div>
                        </div>
                        <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', flex: 1, zIndex: 1 }}>
                                <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>Explore Java and Bali</h3>
                                <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: 'white' }}>Seamless connection from Jakarta to Bali via executive shuttles.</p>
                                <button className="primary">Search routes</button>
                            </div>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80) center/cover',
                            }}></div>
                        </div>
                    </div>
                </div>

                {/* Quick and easy trip planner */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Quick and easy trip planner</h2>
                    <p style={{ marginBottom: '20px', color: '#666' }}>Pick a vibe and explore the top destinations in Indonesia</p>
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                        {[
                            { name: 'City', img: 'https://images.unsplash.com/photo-1555899434-94d1368d7eaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
                            { name: 'Nature', img: 'https://images.unsplash.com/photo-1637651086082-2736b048598f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
                            { name: 'Relaxing', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
                            { name: 'Beaches', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
                            { name: 'Culture', img: 'https://plus.unsplash.com/premium_photo-1661964149725-fbf14e65bc2f?q=80&w=400&auto=format&fit=crop' }
                        ].map((vibe) => (
                            <div key={vibe.name}
                                onClick={() => window.open('/inspiration/' + vibe.name, '_blank')}
                                className="card"
                                style={{
                                    minWidth: '200px',
                                    height: '120px',
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    borderRadius: '15px',
                                    flexShrink: 0
                                }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: `linear-gradient(to top, rgba(0,0,0,0.6), transparent), url(${vibe.img}) center/cover`,
                                    transition: 'transform 0.3s'
                                }}
                                    onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                ></div>
                                <div style={{
                                    position: 'absolute', bottom: '15px', left: '15px',
                                    color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    pointerEvents: 'none'
                                }}>
                                    {vibe.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Destinations */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Trending destinations</h2>
                    <p style={{ marginBottom: '20px', color: '#666' }}>Most popular choices for travellers from Indonesia</p>
                    <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <div className="card" style={{ height: '250px', position: 'relative', border: 'none', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>Bali</h3>
                                <img src="https://flagcdn.com/w20/id.png" alt="Indonesia" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                            </div>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent), url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                        </div>
                        <div className="card" style={{ height: '250px', position: 'relative', border: 'none', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>Jakarta</h3>
                                <img src="https://flagcdn.com/w20/id.png" alt="Indonesia" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                            </div>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent), url(https://images.unsplash.com/photo-1555899434-94d1368d7eaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80) center/cover' }}></div>
                        </div>
                    </div>
                    <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '16px' }}>
                        <div className="card" style={{ height: '200px', position: 'relative', border: 'none', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ fontSize: '1.2rem' }}>Yogyakarta</h3>
                                <img src="https://flagcdn.com/w20/id.png" alt="Indonesia" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                            </div>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent), url(https://plus.unsplash.com/premium_photo-1661964149725-fbf14e65bc2f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) center/cover' }}></div>
                        </div>
                        <div className="card" style={{ height: '200px', position: 'relative', border: 'none', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ fontSize: '1.2rem' }}>Surabaya</h3>
                                <img src="https://flagcdn.com/w20/id.png" alt="Indonesia" style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                            </div>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent), url(https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80) center/cover' }}></div>
                        </div>
                        <div className="card" style={{ height: '200px', position: 'relative', border: 'none', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ fontSize: '1.2rem' }}>Malang</h3>
                            </div>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent), url(https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80) center/cover' }}></div>
                        </div>
                    </div>
                </div>

                {/* Explore Indonesia */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Explore Indonesia</h2>
                    <div className="card-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                        {[
                            { name: 'Jakarta', img: 'https://images.unsplash.com/photo-1555899434-94d1368d7eaa' },
                            { name: 'Yogyakarta', img: 'https://images.unsplash.com/photo-1584810359583-96fc3448c4a9' },
                            { name: 'Magelang', img: 'https://images.unsplash.com/photo-1596401057633-5b8cb40061e0' },
                            { name: 'Surabaya', img: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87' },
                            { name: 'Ubud', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' }
                        ].map(item => (
                            <div key={item.name} className="card" style={{ border: 'none', cursor: 'pointer' }}>
                                <div className="card-img-placeholder" style={{ height: '120px', overflow: 'hidden' }}>
                                    <img src={`${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <div className="card-content" style={{ padding: '10px 0' }}>
                                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Bus terminals & stops</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How to Reserve Section */}
                <div style={{ marginBottom: '60px', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h2 className="section-title" style={{ textAlign: 'center' }}>How to Start Your Journey</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center', marginTop: '30px' }}>
                        <div>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                            <h3>Search</h3>
                            <p style={{ color: '#666' }}>Enter your origin, destination, and travel date.</p>
                        </div>
                        <div>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
                            <h3>Select</h3>
                            <p style={{ color: '#666' }}>Compare schedules, prices, and amenities.</p>
                        </div>
                        <div>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                            <h3>Book</h3>
                            <p style={{ color: '#666' }}>Fill in your details and pay securely.</p>
                        </div>
                        <div>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.5rem', fontWeight: 'bold' }}>4</div>
                            <h3>Travel</h3>
                            <p style={{ color: '#666' }}>Show your E-Ticket and enjoy the ride!</p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div style={{ background: '#003580', color: 'white', padding: '60px 0', marginTop: '60px', borderRadius: '8px' }}>
                    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                        <div>
                            <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '10px', display: 'inline-block' }}>TransportBooking</h3>
                            <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
                                Your trusted partner for comfortable and affordable bus travel across Indonesia.
                            </p>
                        </div>
                        <div>
                            <h3>Contact Us</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>📍 Jl. Sudirman No. 45, Jakarta</li>
                                <li style={{ marginBottom: '10px' }}>📞 +62 21 555 0123</li>
                                <li style={{ marginBottom: '10px' }}>✉️ support@transportbooking.id</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Quick Links</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>About Us</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms & Conditions</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a></li>
                                <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <p>&copy; 2025 TransportBooking. All rights reserved.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
