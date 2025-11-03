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

// ✅ dynamic CORS origin based on environment
const allowedOrigins = [
  'http://localhost:5173',          // vite dev
  'http://localhost:3000',          // react-scripts dev
  'https://employee-attendance-management-336l.onrender.com', // render frontend
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/batchowners', batchOwnerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
