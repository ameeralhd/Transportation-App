const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Dashboard Statistics
router.get('/stats', verifyAdmin, (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // We need to run multiple queries, so we'll do them sequentially or use Promise.all wrapper
    // For simplicity with callback-based sqlite3:

    db.serialize(() => {
        const stats = {};

        // 1. Today's Reservations
        db.get("SELECT COUNT(*) as count FROM bookings WHERE bookingDate LIKE ?", [`${today}%`], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.todayReservations = row.count;

            // 2. Cancellations Pending
            db.get("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancellation_pending'", (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.pendingCancellations = row.count;

                // 3. Total Revenue (Confirmed bookings)
                // Need to join with schedules to get price
                const revenueQuery = `
                    SELECT SUM(s.price) as total 
                    FROM bookings b
                    JOIN schedules s ON b.scheduleId = s.id
                    WHERE b.status = 'confirmed'
                `;
                db.get(revenueQuery, (err, row) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.revenue = row.total || 0;

                    res.json(stats);
                });
            });
        });
    });
});

// Activity Logs
router.get('/logs', verifyAdmin, (req, res) => {
    db.all("SELECT l.*, u.username as admin_name FROM activity_logs l LEFT JOIN users u ON l.admin_id = u.id ORDER BY l.timestamp DESC LIMIT 50", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
