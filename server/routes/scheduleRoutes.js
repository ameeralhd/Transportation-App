const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get all schedules (Public)
router.get('/', (req, res) => {
    const { source, destination, date } = req.query;
    let query = "SELECT * FROM schedules WHERE availableSeats > 0";
    let params = [];

    if (source) {
        query += " AND source LIKE ?";
        params.push(`%${source}%`);
    }
    if (destination) {
        query += " AND destination LIKE ?";
        params.push(`%${destination}%`);
    }
    if (date) {
        // Assuming date format matches or we filter by day
        query += " AND departureTime LIKE ?";
        params.push(`%${date}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Schedule (Admin)
router.post('/', verifyAdmin, (req, res) => {
    const { source, destination, departureTime, price, availableSeats } = req.body;
    if (!source || !destination || !departureTime || !price || !availableSeats) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const stmt = db.prepare("INSERT INTO schedules (source, destination, departureTime, price, availableSeats) VALUES (?, ?, ?, ?, ?)");
    stmt.run(source, destination, departureTime, price, availableSeats, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Schedule created' });
    });
    stmt.finalize();
});

// Delete Schedule (Admin)
router.delete('/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM schedules WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Schedule deleted', changes: this.changes });
    });
});

module.exports = router;
