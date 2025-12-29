import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const contentData = {
    'City': {
        title: "Urban Excitement in Jakarta",
        subtitle: "Experience the vibrant pulse of Indonesia's capital",
        heroImage: "https://images.unsplash.com/photo-1555899434-94d1368d7eaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        description: "Jakarta is a dynamic megalopolis where luxury shopping malls stand beside historic colonial buildings. Dive into a world of culinary adventures, endless entertainment, and a nightlife that never stops.",
        destination: "Jakarta",
        highlights: [
            { title: "Grand Indonesia", img: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Monas Monument", img: "https://images.unsplash.com/photo-1596401057633-5b8cb40061e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Old Batavia", img: "https://images.unsplash.com/photo-1636208266205-b0622941975e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
        ]
    },
    'Nature': {
        title: "Breathe in Bogor",
        subtitle: "Escape to the lush green hills and cooling mists",
        heroImage: "https://images.unsplash.com/photo-1637651086082-2736b048598f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        description: "Just a short drive from the capital, Bogor offers a refreshing retreat. Explore the world-famous Botanical Gardens, hike through tea plantations, and rejuvenate your soul in nature.",
        destination: "Bogor",
        highlights: [
            { title: "Tea Plantations", img: "https://images.unsplash.com/photo-1558253163-95568194458f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Botanical Gardens", img: "https://images.unsplash.com/photo-1596395811776-65825bd2a632?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Waterfalls", img: "https://images.unsplash.com/photo-1543224050-b3bd38676bf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
        ]
    },
    'Relaxing': {
        title: "The Charm of Bandung",
        subtitle: "Paris van Java awaits with culture and comfort",
        heroImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        description: "Surrounded by mountains, Bandung fits the perfect definition of relaxation. Enjoy the cool breeze, sip on local coffee, and shop at famous factory outlets.",
        destination: "Bandung",
        highlights: [
            { title: "Kawah Putih", img: "https://images.unsplash.com/photo-1574540455489-02947113e648?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Braga Street", img: "https://images.unsplash.com/photo-1627914902806-253fb43ab707?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Glamping Sites", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
        ]
    },
    'Beaches': {
        title: "Island Paradise in Bali",
        subtitle: "Sun, sand, and spiritual serenity",
        heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        description: "World-renowned for a reason. Whether you're a surfer chasing waves, a yogi seeking peace, or a traveler looking for the best beach clubs, Bali has it all.",
        destination: "Bali",
        highlights: [
            { title: "Kelingking Beach", img: "https://images.unsplash.com/photo-1590664095612-4d4b9b919a3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { title: "Rice Terraces", img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { title: "Uluwatu Temple", img: "https://images.unsplash.com/photo-1596401057633-5b8cb40061e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
        ]
    },
    'Culture': {
        title: "Historical Yogyakarta",
        subtitle: "The soul of Javanese heritage",
        heroImage: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14e65bc2f?q=80&w=2072&auto=format&fit=crop",
        description: "Step back in time. Visit the majestic Borobudur temple, explore the Sultan's palace, and witness the timeless traditions of batik and wayang puppetry.",
        destination: "Yogyakarta",
        highlights: [
            { title: "Borobudur", img: "https://images.unsplash.com/photo-1596401057633-5b8cb40061e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Prambanan", img: "https://images.unsplash.com/photo-1604928141064-207d60ae613d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { title: "Malioboro", img: "https://images.unsplash.com/photo-1584810359583-96fc3448c4a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
        ]
    }
};

const Inspiration = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const data = contentData[category];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    if (!data) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Category not found</div>;

    return (
        <div className="animate-fade-in">
            {/* Hero Video/Image */}
            <div style={{
                height: '80vh',
                position: 'relative',
                background: `url(${data.heroImage}) center/cover`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '30px',
                        marginBottom: '20px',
                        backdropFilter: 'blur(5px)'
                    }}>
                        EXPLORE {category.toUpperCase()}
                    </span>
                    <h1 style={{ fontSize: '4rem', marginBottom: '20px', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                        {data.title}
                    </h1>
                    <p style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto 40px', opacity: 0.9 }}>
                        {data.subtitle}
                    </p>
                    <button
                        onClick={() => navigate(`/search?destination=${data.destination}`)}
                        className="primary"
                        style={{
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            borderRadius: '50px',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Find Trips to {data.destination}
                    </button>
                </div>
            </div>

            {/* Description Section */}
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2 className="section-title">Why visit {category}?</h2>
                <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: '0 auto 30px' }}></div>
                <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    {data.description}
                </p>
            </div>

            {/* Gallery Grid */}
            <div style={{ background: '#f8f9fa', padding: '80px 0' }}>
                <div className="container">
                    <h2 className="section-title" style={{ marginBottom: '50px' }}>Highlights</h2>
                    <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {data.highlights.map((item, index) => (
                            <div key={index} className="card" style={{ border: 'none', overflow: 'hidden', borderRadius: '15px' }}>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                    />
                                </div>
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <h3 style={{ margin: 0 }}>{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ background: '#003580', color: 'white', padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2>Ready to start your adventure?</h2>
                    <p style={{ fontSize: '1.2rem', margin: '20px 0 40px', opacity: 0.8 }}>Book your comfortable ride to {data.destination} today.</p>
                    <button
                        onClick={() => navigate(`/search?destination=${data.destination}`)}
                        style={{
                            padding: '15px 40px',
                            fontSize: '1.1rem',
                            background: 'var(--secondary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Book Now
                    </button>
                    <br />
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'transparent', border: 'none', color: 'white', marginTop: '20px', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inspiration;
