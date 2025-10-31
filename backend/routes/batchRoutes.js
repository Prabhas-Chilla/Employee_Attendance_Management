
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin','batch_owner'), async (req, res) => {
  try {
 
    if (req.user.role === 'batch_owner' && req.user.batch_id) {
      const [rows] = await db.query('SELECT * FROM batches WHERE id = ?', [req.user.batch_id]);
      return res.json(rows);
    }
    const [rows] = await db.query('SELECT b.*, bo.username AS owner_username FROM batches b LEFT JOIN batch_owners bo ON b.owner_id = bo.id ORDER BY b.id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, owner_id, category } = req.body;
    if (!name || !category)
      return res.status(400).json({ message: 'Batch name and category required' });

    const [result] = await db.query(
      'INSERT INTO batches (name, owner_id, category) VALUES (?, ?, ?)',
      [name, owner_id || null, category]
    );
    res.json({ id: result.insertId, name, owner_id, category });
  } catch (err) {
    console.error('Batch create error:', err);
    res.status(500).json({ message: 'Failed to create batch' });
  }
});

module.exports = router;
