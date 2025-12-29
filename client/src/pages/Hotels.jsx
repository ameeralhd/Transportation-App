import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when hotels change or user location is found
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 13);
        }
    }, [lat, lng, map]);
    return null;
};

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [userLocation, setUserLocation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async (cityName = '') => {
        setLoading(true);
        try {
            const url = cityName ? `/hotels?city=${cityName}` : '/hotels';
            const res = await api.get(url);
            let data = res.data;

            // If user location exists, calculate distance and sort
            if (userLocation) {
                data = data.map(hotel => {
                    const dist = calculateDistance(userLocation.lat, userLocation.lng, hotel.latitude, hotel.longitude);
                    return { ...hotel, distance: dist };
                }).sort((a, b) => a.distance - b.distance);
            }

            setHotels(data);
        } catch (err) {
            console.error('Failed to fetch hotels', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchHotels(city);
        const resultsEl = document.getElementById('hotel-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
    };

    const handleUseLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });

                    // Sort existing hotels by distance immediately
                    const sortedHotels = [...hotels].map(hotel => {
                        const dist = calculateDistance(latitude, longitude, hotel.latitude, hotel.longitude);
                        return { ...hotel, distance: dist };
                    }).sort((a, b) => a.distance - b.distance);

                    setHotels(sortedHotels);
                    setCity('Current Location');
                    setLoading(false);
                    setViewMode('map'); // Switch to map view to show user location
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Could not get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // Derived featured hotels
    const featuredHotels = hotels.filter(h => h.rating >= 4.5).slice(0, 3);

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
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80) center/cover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                marginBottom: '40px'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '15px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Find Your Perfect Stay</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '30px' }}>Discover top-rated hotels, resorts, and vacation rentals across Indonesia.</p>

                {/* Floating Search Bar */}
                <form onSubmit={handleSearch} style={{
                    background: 'white',
                    padding: '10px',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    maxWidth: '850px',
                    width: '95%',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid #ddd', minWidth: '200px' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>📍</span>
                        <input
                            type="text"
                            placeholder="Where are you going?"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
                        />
                        <button
                            type="button"
                            onClick={handleUseLocation}
                            title="Use My Location"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
                        >
                            🎯
                        </button>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid #ddd', minWidth: '150px' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>📅</span>
                        <input
                            type="date"
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
                        />
                    </div>
                    <div style={{ flex: 0.7, display: 'flex', alignItems: 'center', padding: '0 20px', minWidth: '120px' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>👥</span>
                        <input
                            type="number"
                            placeholder="2 Guests"
                            min="1"
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
                        />
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
                {/* View Toggle */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <button
                            style={{ padding: '10px 20px', border: 'none', background: viewMode === 'list' ? 'var(--primary-color)' : 'white', color: viewMode === 'list' ? 'white' : 'black', cursor: 'pointer' }}
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </button>
                        <button
                            style={{ padding: '10px 20px', border: 'none', background: viewMode === 'map' ? 'var(--primary-color)' : 'white', color: viewMode === 'map' ? 'white' : 'black', cursor: 'pointer' }}
                            onClick={() => setViewMode('map')}
                        >
                            Map View
                        </button>
                    </div>
                </div>

                {/* List View Content */}
                {viewMode === 'list' && (
                    <>
                        {/* Featured / Recommended - Only show if hotels are loaded */}
                        {!city && hotels.length > 0 && (
                            <div style={{ marginBottom: '50px' }}>
                                <h2 className="section-title">Recommended for You</h2>
                                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                    {featuredHotels.map(hotel => (
                                        <div key={hotel.id} className="card" style={{ cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                            <div style={{ height: '220px', position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    background: 'white', padding: '5px 10px', borderRadius: '15px',
                                                    fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--secondary-color)',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                }}>
                                                    ★ {hotel.rating}
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
                                                <div style={{ width: '100%', height: '100%', background: `url(${hotel.image_url}) center/cover` }}></div>
                                            </div>
                                            <div className="card-content">
                                                <h3 style={{ marginBottom: '5px' }}>{hotel.name}</h3>
                                                <p style={{ color: '#666', fontSize: '0.9rem' }}>📍 {hotel.city}</p>
                                                <div style={{ marginTop: '15px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                                    Rp {hotel.price_per_night.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>/night</span>
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
                                <h2 className="section-title">Trending Destinations</h2>
                                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                    {trendingDestinations.map((dest, index) => (
                                        <div key={index} className="card" onClick={() => setCity(dest.name)} style={{ cursor: 'pointer', border: 'none', position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(${dest.image}) center/cover`
                                            }}></div>
                                            <div style={{ position: 'absolute', bottom: 15, left: 15, color: 'white' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{dest.name}</h3>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Popular this week</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Results */}
                        <div id="hotel-results">
                            {city && <h2 className="section-title">Search Results for "{city}"</h2>}
                            {userLocation && <p style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Sorted by distance from your location</p>}

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏨</div>
                                    Finding best rates...
                                </div>
                            ) : (
                                <div className="card-grid">
                                    {hotels.map(hotel => (
                                        <div key={hotel.id} className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                                            <div style={{ width: '300px', background: `url(${hotel.image_url}) center/cover`, minHeight: '200px' }}></div>
                                            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{hotel.name}</h3>
                                                        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 10px 0' }}>📍 {hotel.address}</p>
                                                        {hotel.distance && (
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                                                📏 {hotel.distance.toFixed(1)} km away
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '5px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                        ★ {hotel.rating}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>{hotel.amenities}</p>

                                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Price per night</span>
                                                        <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>Rp {hotel.price_per_night.toLocaleString()}</h3>
                                                    </div>
                                                    <button className="primary" style={{ borderRadius: '25px', padding: '10px 25px' }} onClick={() => navigate('/hotels/' + hotel.id)}>View Deal</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && hotels.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '8px' }}>
                                    <h3>No hotels found for "{city}"</h3>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>Try searching searching for other popular destinations.</p>
                                    <button className="light" onClick={() => setCity('')}>View All Hotels</button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Map View Content */}
                {viewMode === 'map' && (
                    <div style={{ height: '600px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <MapContainer
                            center={userLocation ? [userLocation.lat, userLocation.lng] : [-2.5489, 118.0149]}
                            zoom={userLocation ? 12 : 5}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {userLocation && (
                                <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                            )}
                            {userLocation && (
                                <Marker position={[userLocation.lat, userLocation.lng]}>
                                    <Popup>
                                        You are here!
                                    </Popup>
                                </Marker>
                            )}
                            {hotels.map(hotel => (
                                hotel.latitude && hotel.longitude && (
                                    <Marker key={hotel.id} position={[hotel.latitude, hotel.longitude]}>
                                        <Popup>
                                            <div style={{ minWidth: '200px' }}>
                                                <img src={hotel.image_url} alt={hotel.name} style={{ width: '100%', borderRadius: '5px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />
                                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{hotel.name}</h3>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem' }}>{hotel.city}</p>
                                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: 'var(--primary-color)' }}>Rp {hotel.price_per_night.toLocaleString()}</p>
                                                <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', width: '100%' }} onClick={() => navigate('/hotels/' + hotel.id)}>View Deal</button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hotels;
