import React from 'react';

const Stats = () => {
    // Hardcoded stats for demonstration as per requirements for "Infographics / Data Summary"
    // In a real app, this would fetch from an API like /api/stats
    const stats = {
        totalReservations: 1240,
        occupancyRate: 85,
        cancellations: 45,
        popularDestinations: [
            { name: 'Bandung', value: 40 },
            { name: 'Yogyakarta', value: 30 },
            { name: 'Surabaya', value: 20 },
            { name: 'Bali', value: 10 },
        ]
    };

    return (
        <div className="animate-fade-in container" style={{ margin: '40px auto' }}>
            <h2 className="section-title">Platform Statistics</h2>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>Real-time insights into our transportation network.</p>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <h3 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--primary-color)' }}>{stats.totalReservations}</h3>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>Total Reservations</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <h3 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--secondary-color)' }}>{stats.occupancyRate}%</h3>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>Average Occupancy</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <h3 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#d32f2f' }}>{stats.cancellations}</h3>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>Cancellations</p>
                </div>
            </div>

            <div className="card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Popular Destinations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {stats.popularDestinations.map(d => (
                        <div key={d.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span>{d.name}</span>
                                <span>{d.value}%</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${d.value}%`,
                                    height: '100%',
                                    background: 'var(--primary-color)',
                                    borderRadius: '5px'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;
