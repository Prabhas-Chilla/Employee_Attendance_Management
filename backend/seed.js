// seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  try {
    console.log('🌱 Running seed...');

    // Create tables in safe order
    await db.query(`CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await db.query(`CREATE TABLE IF NOT EXISTS batches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      owner_id INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await db.query(`CREATE TABLE IF NOT EXISTS batch_owners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(255) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      batch_id INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await db.query(`CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) DEFAULT NULL,
      batch_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    // add attendance table
    await db.query(`CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      attendance_date DATE NOT NULL,
      batch_id INT NOT NULL,
      employee_id INT NOT NULL,
      status ENUM('Present','Absent','Leave') NOT NULL DEFAULT 'Absent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_attendance (attendance_date, employee_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    // set foreign keys after tables exist
    // (simpler to add constraints here; if your db engine requires it, you can alter table instead)
    try {
      await db.query(`ALTER TABLE batch_owners ADD CONSTRAINT fk_bo_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL`);
    } catch (err) { /* ignore if exists */ }

    try {
      await db.query(`ALTER TABLE employees ADD CONSTRAINT fk_emp_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE`);
    } catch (err) { /* ignore if exists */ }

    try {
      await db.query(`ALTER TABLE attendance ADD CONSTRAINT fk_att_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE`);
      await db.query(`ALTER TABLE attendance ADD CONSTRAINT fk_att_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE`);
    } catch (err) { /* ignore if exists */ }

    // get secure passwords from env
    const adminRaw = process.env.ADMIN_PASSWORD;
    const ownerRaw = process.env.OWNER_PASSWORD;
    const empRaw = process.env.EMP_PASSWORD;

    if (!adminRaw || !ownerRaw || !empRaw) {
      console.error('Please set ADMIN_PASSWORD, OWNER_PASSWORD, EMP_PASSWORD in your .env');
      process.exit(1);
    }

    const adminPass = await bcrypt.hash(adminRaw, 10);
    const ownerPass = await bcrypt.hash(ownerRaw, 10);
    const empPass = await bcrypt.hash(empRaw, 10);

    // insert admin
    await db.query('INSERT IGNORE INTO admins (username, password, fullname) VALUES (?,?,?)',
      ['admin', adminPass, 'Site Admin']);

    // insert batch owner
    await db.query('INSERT IGNORE INTO batch_owners (username, password, fullname, email) VALUES (?,?,?,?)',
      ['owner1', ownerPass, 'Owner One', 'owner1@example.com']);

    // create batch and link owner
    const [r] = await db.query('INSERT IGNORE INTO batches (name) VALUES (?)', ['Batch A']);
    let batchId;
    if (r.insertId) batchId = r.insertId;
    else {
      const [rows] = await db.query('SELECT id FROM batches WHERE name = ?', ['Batch A']);
      batchId = rows[0].id;
    }

    await db.query('UPDATE batch_owners SET batch_id = ? WHERE username = ?', [batchId, 'owner1']);
    await db.query('UPDATE batches SET owner_id = (SELECT id FROM batch_owners WHERE username = ?) WHERE id = ?', ['owner1', batchId]);

    // insert sample employees
    await db.query('INSERT IGNORE INTO employees (employee_code, name, username, password, email, batch_id) VALUES (?,?,?,?,?,?)',
      ['EMP001','Alice','alice', empPass, 'alice@example.com', batchId]);
    await db.query('INSERT IGNORE INTO employees (employee_code, name, username, password, email, batch_id) VALUES (?,?,?,?,?,?)',
      ['EMP002','Bob','bob', empPass, 'bob@example.com', batchId]);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
