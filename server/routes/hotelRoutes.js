const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get all hotels or filter by city
router.get('/', (req, res) => {
    const { city } = req.query;
    let query = "SELECT * FROM hotels";
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

// Get hotel by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM hotels WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Hotel not found' });
        res.json(row);
    });
});

// Create new hotel
router.post('/', (req, res) => {
    const { name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude } = req.body;
    const sql = `INSERT INTO hotels (name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Hotel created', id: this.lastID });
    });
});

// Update hotel
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude } = req.body;
    const sql = `UPDATE hotels SET name = ?, city = ?, address = ?, price_per_night = ?, rating = ?, image_url = ?, amenities = ?, latitude = ?, longitude = ? WHERE id = ?`;
    const params = [name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude, id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Hotel updated' });
    });
});

// Delete hotel
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM hotels WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Hotel deleted' });
    });
});

module.exports = router;
