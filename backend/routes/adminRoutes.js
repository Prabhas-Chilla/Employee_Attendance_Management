
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('admin'));

// POST /api/admin/create-batchowner
// body: { username, password, fullname, email }
router.post('/create-batchowner', async (req, res) => {
  const { username, password, fullname, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO batch_owners (username, password, fullname, email) VALUES (?,?,?,?)',
      [username, hash, fullname || null, email || null]);
    res.json({ message: 'Batch owner created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/create-batch
// body: { name, owner_id }
router.post('/create-batch', async (req, res) => {
  const { name, owner_id } = req.body;
  if (!name) return res.status(400).json({ message: 'Batch name required' });
  try {
    const [r] = await db.query('INSERT INTO batches (name, owner_id) VALUES (?, ?)', [name, owner_id || null]);
    // If owner_id provided, update batch_owners.batch_id
    if (owner_id) await db.query('UPDATE batch_owners SET batch_id = ? WHERE id = ?', [r.insertId, owner_id]);
    res.json({ message: 'Batch created', id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/create-employee
// body: { name, username, password, employee_code, batch_id, email }
router.post('/create-employee', async (req, res) => {
  const { name, username, password, employee_code, batch_id, email } = req.body;
  if (!name || !username || !password || !batch_id || !employee_code) {
    return res.status(400).json({ message: 'missing required fields' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query('INSERT INTO employees (employee_code, name, username, password, email, batch_id) VALUES (?,?,?,?,?,?)',
      [employee_code, name, username, hash, email || null, batch_id]);
    res.json({ message: 'Employee created', id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
