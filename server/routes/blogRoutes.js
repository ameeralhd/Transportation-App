const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get all blogs (Public)
router.get('/', (req, res) => {
    db.all("SELECT * FROM blogs ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Blog (Admin)
router.post('/', verifyAdmin, (req, res) => {
    const { title, content, image_url } = req.body;
    const author = req.user.username; // From verified token
    const created_at = new Date().toISOString();

    db.run("INSERT INTO blogs (title, content, author, created_at, image_url) VALUES (?, ?, ?, ?, ?)",
        [title, content, author, created_at, image_url],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Log activity
            db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
                [req.user.id, 'CREATE_BLOG', `Created blog: ${title}`, new Date().toISOString()]
            );

            res.status(201).json({ id: this.lastID, message: 'Blog created' });
        });
});

// Delete Blog (Admin)
router.delete('/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM blogs WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'DELETE_BLOG', `Deleted blog ID: ${id}`, new Date().toISOString()]
        );

        res.json({ message: 'Blog deleted' });
    });
});

module.exports = router;
