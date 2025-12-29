const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const hotelBookingRoutes = require('./routes/hotelBookingRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rentals', rentalRoutes);

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
