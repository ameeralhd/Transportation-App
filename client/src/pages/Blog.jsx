import React from 'react';

const articles = [
    {
        id: 1,
        title: "Safety on Board: Your Well-being is Our Priority",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        summary: "Traveling by bus is one of the safest ways to see the country. Here are our top tips for a secure and comfortable journey, including seatbelt usage and luggage safety.",
        date: "Dec 10, 2025",
        author: "Safety Team"
    },
    {
        id: 2,
        title: "Top 5 Destinations in Java You Can't Miss",
        image: "https://images.unsplash.com/photo-1596402180389-f7f3852d35a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        summary: "From the cultural heart of Yogyakarta to the bustling streets of Surabaya. Discover the hidden gems of Java that are easily accessible via our executive bus fleet.",
        date: "Dec 15, 2025",
        author: "Travel Guide"
    },
    {
        id: 3,
        title: "How to Use E-Tickets for a Paperless Journey",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        summary: "Save time and the environment! Learn how to book, access, and scan your digital tickets directly from your phone. No printing required.",
        date: "Dec 20, 2025",
        author: "Tech Support"
    }
];

const Blog = () => {
    return (
        <div className="animate-fade-in container">
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Travel Blog</h2>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>Tips, guides, and news for the modern traveler</p>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {articles.map(article => (
                    <div key={article.id} className="card" style={{ height: 'auto' }}>
                        <div className="card-img-placeholder" style={{ height: '200px' }}>
                            <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="card-content">
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{article.author} • {article.date}</span>
                            <h3 style={{ margin: '10px 0', fontSize: '1.3rem' }}>{article.title}</h3>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{article.summary}</p>
                            <button className="light" style={{ marginTop: '15px', padding: '0', color: 'var(--secondary-color)', background: 'none', textDecoration: 'underline' }}>Read validation...</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
