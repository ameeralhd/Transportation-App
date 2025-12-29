const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get My Bookings (User)
router.get('/my', verifyToken, (req, res) => {
    const query = `
    SELECT b.id, b.bookingDate, s.source, s.destination, s.departureTime, s.price 
    FROM bookings b 
    JOIN schedules s ON b.scheduleId = s.id 
    WHERE b.userId = ?
  `;
    db.all(query, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Booking (User)
router.post('/', verifyToken, (req, res) => {
    const { scheduleId, passengers, contact_details } = req.body;
    if (!scheduleId || !passengers || !contact_details) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start Transaction
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Check availability
        db.get("SELECT availableSeats FROM schedules WHERE id = ?", [scheduleId], (err, row) => {
            if (err || !row) {
                db.run("ROLLBACK");
                return res.status(404).json({ error: 'Schedule not found or error' });
            }

            if (row.availableSeats < passengers) {
                db.run("ROLLBACK");
                return res.status(400).json({ error: 'Not enough seats available' });
            }

            // Decrement seats
            db.run("UPDATE schedules SET availableSeats = availableSeats - ? WHERE id = ?", [passengers, scheduleId], (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: 'Failed to update schedule' });
                }

                // Insert Booking
                const bookingDate = new Date().toISOString();
                db.run("INSERT INTO bookings (userId, scheduleId, bookingDate, passengers, contact_details) VALUES (?, ?, ?, ?, ?)",
                    [req.userId, scheduleId, bookingDate, passengers, contact_details], function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return res.status(500).json({ error: 'Failed to create booking' });
                        }

                        db.run("COMMIT");
                        res.status(201).json({ message: 'Booking successful', bookingId: this.lastID });
                    });
            });
        });
    });
});

// Check-in (Public)
router.post('/checkin', (req, res) => {
    const { bookingId, contact } = req.body;
    db.get("SELECT * FROM bookings WHERE id = ? AND contact_details LIKE ?", [bookingId, `%${contact}%`], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Booking not found or details incorrect' });

        // Simulating check-in success
        res.json({ message: 'Check-in Successful!', seat: '12A', booking: row });
    });
});

// Cancel Booking (User)
// Cancel Booking (User Requests Cancellation)
router.post('/:id/cancel', verifyToken, (req, res) => {
    const { reason } = req.body;
    const bookingId = req.params.id;

    db.get("SELECT * FROM bookings WHERE id = ? AND userId = ?", [bookingId, req.userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Booking not found' });
        if (row.status !== 'confirmed') return res.status(400).json({ error: `Cannot cancel booking with status: ${row.status}` });

        db.run("UPDATE bookings SET status = 'cancellation_pending', cancellation_reason = ? WHERE id = ?", [reason, bookingId], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to request cancellation' });
            res.json({ message: 'Cancellation requested. Waiting for admin approval.' });
        });
    });
});

// --- Admin Booking Management ---

// Get all pending bookings for admin review
router.get('/pending', verifyAdmin, (req, res) => {
    const query = `
        SELECT b.id, b.bookingDate, b.passengers, b.contact_details, b.status, u.username, s.source, s.destination, s.departureTime, s.price 
        FROM bookings b
        JOIN users u ON b.userId = u.id
        JOIN schedules s ON b.scheduleId = s.id
        WHERE b.status = 'pending'
    `;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Approve a booking
router.post('/:id/approve', verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("UPDATE bookings SET status = 'confirmed' WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'APPROVE_BOOKING', `Approved Booking ID: ${id}`, new Date().toISOString()]
        );

        res.json({ message: 'Booking approved' });
    });
});

// Reject a booking
router.post('/:id/reject', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    db.get("SELECT * FROM bookings WHERE id = ?", [id], (err, booking) => {
        if (err || !booking) return res.status(404).json({ error: 'Booking not found' });

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            db.run("UPDATE bookings SET status = 'rejected', cancellation_reason = ? WHERE id = ?", [reason, id], (err) => {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: 'Failed to reject booking' });
                }

                // Return seats to schedule
                db.run("UPDATE schedules SET availableSeats = availableSeats + ? WHERE id = ?", [booking.passengers, booking.scheduleId], (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: 'Failed to return seats' });
                    }

                    // Log activity
                    db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
                        [req.user.id, 'REJECT_BOOKING', `Rejected Booking ID: ${id}. Reason: ${reason}`, new Date().toISOString()]
                    );

                    db.run("COMMIT");
                    res.json({ message: 'Booking rejected and seats returned' });
                });
            });
        });
    });
});

module.exports = router;
