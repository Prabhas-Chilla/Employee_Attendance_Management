// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// POST /api/attendance
// body: { attendance_date, batch_id, records: [{ employee_id, status }, ...] }
// allowed: admin, batch_owner
router.post('/', authenticateToken, authorizeRoles('admin','batch_owner'), async (req, res) => {
  try {
    const { attendance_date, batch_id, records } = req.body;
    if (!attendance_date || !batch_id || !Array.isArray(records)) return res.status(400).json({ message: 'Invalid payload' });

    // if batch_owner, ensure they only modify their batch
    if (req.user.role === 'batch_owner' && req.user.batch_id != batch_id) {
      return res.status(403).json({ message: 'Cannot modify other batch' });
    }

    for (const r of records) {
      const { employee_id, status } = r;
      // upsert
      await db.query(
        `INSERT INTO attendance (attendance_date, batch_id, employee_id, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [attendance_date, batch_id, employee_id, status]
      );
    }

    res.json({ message: 'Attendance saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/history/:employee_id', authenticateToken, authorizeRoles('admin','batch_owner','employee'), async (req, res) => {
  try {
    const employeeId = req.params.employee_id;
   
    if (req.user.role === 'employee' && req.user.id != employeeId) return res.status(403).json({ message: 'Forbidden' });


    if (req.user.role === 'batch_owner') {
      const [emp] = await db.query('SELECT batch_id FROM employees WHERE id = ?', [employeeId]);
      if (!emp.length || emp[0].batch_id != req.user.batch_id) return res.status(403).json({ message: 'Forbidden' });
    }

    const [rows] = await db.query('SELECT attendance_date AS date, status, batch_id FROM attendance WHERE employee_id = ? ORDER BY attendance_date DESC', [employeeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
