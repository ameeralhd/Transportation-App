const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

const { verifyToken } = require('../middleware/auth');

// Get all rental cars or filter by city
router.get('/', (req, res) => {
    const { city } = req.query;
    let query = "SELECT * FROM rental_cars";
    let params = [];

    if (city) {
        query += " WHERE city LIKE ?";
        params.push(`%${city}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get rental car by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM rental_cars WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Car not found' });
        res.json(row);
    });
});

// Create new rental car (Admin)
router.post('/', (req, res) => {
    const { name, city, type, price_per_day, seats, image_url, latitude, longitude } = req.body;
    const sql = `INSERT INTO rental_cars (name, city, type, price_per_day, seats, image_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, city, type, price_per_day, seats, image_url, latitude, longitude];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rental car created', id: this.lastID });
    });
});

// Update rental car (Admin)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, city, type, price_per_day, seats, image_url, latitude, longitude } = req.body;
    const sql = `UPDATE rental_cars SET name = ?, city = ?, type = ?, price_per_day = ?, seats = ?, image_url = ?, latitude = ?, longitude = ? WHERE id = ?`;
    const params = [name, city, type, price_per_day, seats, image_url, latitude, longitude, id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rental car updated' });
    });
});

// Delete rental car (Admin)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM rental_cars WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rental car deleted' });
    });
});

// --- Rental Booking Routes ---

// Get My Rental Bookings
router.get('/bookings/my', verifyToken, (req, res) => {
    const query = `
        SELECT rb.*, rc.name, rc.city, rc.image_url 
        FROM rental_bookings rb
        JOIN rental_cars rc ON rb.carId = rc.id
        WHERE rb.userId = ?
        ORDER BY rb.created_at DESC
    `;
    db.all(query, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Rental Booking
router.post('/book', verifyToken, (req, res) => {
    const { carId, startDate, endDate, totalPrice, contact_details, driver_license } = req.body;

    if (!carId || !startDate || !endDate || !totalPrice || !contact_details) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const created_at = new Date().toISOString();

    const sql = `INSERT INTO rental_bookings (userId, carId, startDate, endDate, totalPrice, contact_details, driver_license, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [req.userId, carId, startDate, endDate, totalPrice, contact_details, driver_license, created_at];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Rental booking created successfully', bookingId: this.lastID });
    });
});

// Cancel Rental Booking
router.post('/bookings/:id/cancel', verifyToken, (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM rental_bookings WHERE id = ? AND userId = ?", [id, req.userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Booking not found' });

        db.run("UPDATE rental_bookings SET status = 'cancelled' WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Rental booking cancelled' });
        });
    });
});

module.exports = router;
