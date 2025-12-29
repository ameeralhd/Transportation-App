const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

const SECRET = process.env.JWT_SECRET || 'secret_key';

router.post('/register', (req, res) => {
    const { username, password, full_name, phone } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare("INSERT INTO users (username, password, role, full_name, phone) VALUES (?, ?, ?, ?, ?)");
    stmt.run(username, hashedPassword, 'user', full_name, phone, function (err) { // Default role 'user'
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
    stmt.finalize();
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '24h' });
        res.json({ token, role: user.role, username: user.username });
    });
});

// Update Profile
router.put('/profile', verifyToken, (req, res) => {
    const { full_name, phone, password } = req.body;

    // Build update query dynamically
    let query = "UPDATE users SET full_name = ?, phone = ?";
    let params = [full_name, phone];

    if (password) {
        query += ", password = ?";
        params.push(bcrypt.hashSync(password, 10));
    }

    query += " WHERE id = ?";
    params.push(req.userId);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Return updated user info
        db.get("SELECT id, username, role, full_name, phone FROM users WHERE id = ?", [req.userId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Profile updated', user: row });
        });
    });
});

// --- Admin User Management ---

// Get all users
router.get('/users', verifyAdmin, (req, res) => {
    db.all("SELECT id, username, role, full_name, phone FROM users", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update user role
router.put('/users/:id/role', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // 'admin', 'staff', 'user'

    db.run("UPDATE users SET role = ? WHERE id = ?", [role, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'UPDATE_ROLE', `Updated user ${id} role to ${role}`, new Date().toISOString()]
        );

        res.json({ message: 'Role updated' });
    });
});

// Delete user
router.delete('/users/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Log activity
        db.run("INSERT INTO activity_logs (admin_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
            [req.user.id, 'DELETE_USER', `Deleted user ${id}`, new Date().toISOString()]
        );

        res.json({ message: 'User deleted' });
    });
});

module.exports = router;
