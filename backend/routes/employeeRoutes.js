
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');


router.get('/', authenticateToken, authorizeRoles('admin', 'batch_owner'), async (req, res) => {
  try {
    let query = `
      SELECT e.*, b.name AS batch_name 
      FROM employees e 
      LEFT JOIN batches b ON e.batch_id = b.id 
      ORDER BY e.id DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, username, password, email, batch_id } = req.body;
    if (!name || !username || !password || !batch_id)
      return res.status(400).json({ message: 'All required fields must be filled' });

    const hashed = await bcrypt.hash(password, 10);

    const employee_code = 'EMP-' + Math.floor(1000 + Math.random() * 9000);

    const [result] = await db.query(
      'INSERT INTO employees (employee_code, name, username, password, email, batch_id) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_code, name, username, hashed, email, batch_id]
    );

    res.json({ id: result.insertId, name, username, batch_id });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Failed to create employee' });
  }
});

module.exports = router;
