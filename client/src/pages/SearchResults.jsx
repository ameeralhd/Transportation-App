import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const source = searchParams.get('source') || '';
    const destination = searchParams.get('destination') || '';
    const date = searchParams.get('date') || '';

    useEffect(() => {
        fetchSchedules();
    }, [location.search]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/schedules${location.search}`);
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (schedule) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/book', { state: { schedule } });
    };

    return (
        <div className="animate-fade-in container" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 className="section-title" style={{ marginBottom: '5px' }}>
                        {source && destination ? `${source} to ${destination}` : 'All Schedules'}
                    </h2>
                    <p style={{ color: '#666' }}>
                        {date ? `Departing: ${new Date(date).toLocaleDateString()}` : 'Showing available trips'} • {schedules.length} results found
                    </p>
                </div>
                <button className="light" onClick={() => navigate('/')}>Modify Search</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚌</div>
                    Searching available buses...
                </div>
            ) : (
                <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {schedules.map(s => (
                        <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
                            <div className="card-img-placeholder" style={{ width: '250px', height: '180px', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80) center/cover' }}></div>
                            </div>
                            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{s.source} ➝ {s.destination}</h3>
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                                            {new Date(s.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h3 style={{ margin: '0', color: 'var(--primary-color)' }}>Rp {s.price.toLocaleString()}</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>/person</span>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
                                        <span>🚌 Executive Class</span>
                                        <span>❄️ AC</span>
                                        <span>🔌 Power</span>
                                        <span>💺 Reclining</span>
                                    </div>
                                    <button className="primary" style={{ padding: '10px 30px' }} onClick={() => handleBook(s)}>Select</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {schedules.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <h3>No trips found</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>We couldn't find any buses for this route/date.</p>
                            <button className="primary" onClick={() => navigate('/')}>Search Another Route</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
