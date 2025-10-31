// routes/batchOwnerRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET all batch owners (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT bo.*, b.name AS batch_name 
       FROM batch_owners bo 
       LEFT JOIN batches b ON bo.batch_id = b.id 
       ORDER BY bo.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error loading batch owners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - create new batch owner (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username, password, fullname, email } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO batch_owners (username, password, fullname, email) VALUES (?, ?, ?, ?)',
      [username, hashed, fullname, email]
    );

    res.json({ id: result.insertId, username });
  } catch (err) {
    console.error('Error creating batch owner:', err);
    res.status(500).json({ message: 'Failed to create batch owner' });
  }
});

module.exports = router;
