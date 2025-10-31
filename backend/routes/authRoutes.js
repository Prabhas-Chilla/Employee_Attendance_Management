// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1d';

// POST /api/auth/login
// body: { username, password, role } where role in ('admin','batch_owner','employee')
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'username, password and role are required' });

  let table;
  if (role === 'admin') table = 'admins';
  else if (role === 'batch_owner') table = 'batch_owners';
  else if (role === 'employee') table = 'employees';
  else return res.status(400).json({ message: 'Invalid role' });

  try {
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE username = ?`, [username]);
    if (!rows.length) return res.status(401).json({ message: 'User not found' });
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    // Payload: id, role, batch_id (if present)
    const payload = { id: user.id, role, username: user.username };
    if ('batch_id' in user && user.batch_id) payload.batch_id = user.batch_id;

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, username: user.username, role, batch_id: user.batch_id || null } });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
