Employee Attendance Full Project
--------------------------------
Folder structure:
- backend    (Node/Express)
- frontend   (Vite + React)

DB: MySQL (database name: employee_attendance_db)
Tables created by seed.js: admins, batch_owners, batches, employees, attendance

Run steps:
1) Start MySQL server.
2) Copy backend/.env.example to backend/.env and set DB credentials and JWT_SECRET.
3) In backend folder: npm install
4) Run seed: node seed.js  (this will create tables and seed users)
5) Start backend: npm run dev  (or npm start)
6) In frontend folder: npm install
7) Start frontend: npm run dev (Vite default port 5173)
8) Open frontend at http://localhost:5173/

Sample logins (seeded):
- Admin: username=admin password=admin123
- Batch Owner: username=owner1 password=owner123
- Employees: username=alice / password=emp123, username=bob / password=emp123
