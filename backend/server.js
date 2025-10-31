require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const batchRoutes = require('./routes/batchRoutes');
const batchOwnerRoutes = require('./routes/batchOwnerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);        // login
app.use('/api/admin', adminRoutes);      // admin-only actions
app.use('/api/batches', batchRoutes);    // list/create (protected)
app.use('/api/employees', employeeRoutes);// list/create (protected)
app.use('/api/attendance', attendanceRoutes);
app.use('/api/batchowners', batchOwnerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on http://localhost:${PORT}`));
