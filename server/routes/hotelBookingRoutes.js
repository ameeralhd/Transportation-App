const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get My Hotel Bookings
router.get('/my', verifyToken, (req, res) => {
    const query = `
        SELECT hb.*, h.name as hotel_name, h.city 
        FROM hotel_bookings hb
        JOIN hotels h ON hb.hotelId = h.id
        WHERE hb.userId = ?
    `;
    db.all(query, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Hotel Booking
router.post('/', verifyToken, (req, res) => {
    const { hotelId, checkIn, checkOut, guests, contact_details, total_price } = req.body;
    if (!hotelId || !checkIn || !checkOut || !guests || !contact_details) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO hotel_bookings (userId, hotelId, checkIn, checkOut, guests, contact_details, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [req.userId, hotelId, checkIn, checkOut, guests, JSON.stringify(contact_details), total_price, 'pending'], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Reservation requested. Waiting for admin approval.', bookingId: this.lastID });
    });
});

// --- Admin Management ---

// Get all pending hotel reservations
router.get('/pending', verifyAdmin, (req, res) => {
    const query = `
        SELECT hb.*, u.username, h.name as hotel_name, h.city 
        FROM hotel_bookings hb
        JOIN users u ON hb.userId = u.id
        JOIN hotels h ON hb.hotelId = h.id
        WHERE hb.status = 'pending'
    `;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Approve hotel reservation
router.post('/:id/approve', verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("UPDATE hotel_bookings SET status = 'confirmed' WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'APPROVE_HOTEL', `Approved Hotel Booking ID: ${id}`, new Date().toISOString()]
        );

        res.json({ message: 'Reservation confirmed' });
    });
});

// Reject hotel reservation
router.post('/:id/reject', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    db.run("UPDATE hotel_bookings SET status = 'rejected' WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'REJECT_HOTEL', `Rejected Hotel Booking ID: ${id}. Reason: ${reason || 'None'}`, new Date().toISOString()]
        );

        res.json({ message: 'Reservation rejected' });
    });
});

module.exports = router;
