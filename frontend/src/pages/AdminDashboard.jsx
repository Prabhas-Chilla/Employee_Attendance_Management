import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { clearAuth } from '../services/auth';
import '../styles/styles.css';

export default function AdminDashboard() {
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [batchName, setBatchName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [owners, setOwners] = useState([]);
  const [category, setCategory] = useState('Pilot');
  const [newEmployee, setNewEmployee] = useState({ name: '', username: '', password: '', email: '', batch_id: '' });

  useEffect(() => {
    loadBatches();
    loadOwners();
    loadEmployees();
  }, []);

  async function loadBatches() {
    const res = await API.get('/batches');
    setBatches(res.data);
  }

  async function loadEmployees() {
    const res = await API.get('/employees');
    setEmployees(res.data);
  }

  async function loadOwners() {
    const res = await API.get('/batchowners');
    setOwners(res.data);
  }

  async function addBatch(e) {
    e.preventDefault();
    await API.post('/batches', { name: batchName, owner_id: ownerId, category });
    setBatchName('');
    setOwnerId('');
    setCategory('Pilot');
    loadBatches();
  }

  async function addEmployee(e) {
    e.preventDefault();
    await API.post('/employees', newEmployee);
    setNewEmployee({ name: '', username: '', password: '', email: '', batch_id: '' });
    loadEmployees();
  }

  function logout() {
    clearAuth();
    window.location.href = '/';
  }

  return (
    <div className="dashboard admin-page">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="create-section">
        <h2>Create New Batch</h2>
        <form onSubmit={addBatch} className="form-container">
          <input
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Enter Batch Name"
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Pilot">Pilot Batch</option>
            <option value="Validation">Validation Batch</option>
            <option value="Commercial">Commercial Batch</option>
            <option value="Financial">Financial Batch</option>
            <option value="Agile">Agile Batch</option>
            <option value="Manufacturing">Manufacturing Batch</option>
          </select>

          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">Select Owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.fullname || o.username}
              </option>
            ))}
          </select>
          <button type="submit">Create Batch</button>
        </form>
      </section>

      <section className="create-section">
        <h2>Add Employee to Batch</h2>
        <form onSubmit={addEmployee} className="form-container">
          <input
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            placeholder="Employee Name"
            required
          />
          <input
            value={newEmployee.username}
            onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            placeholder="Password"
            required
          />
          <input
            type="email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            placeholder="Email"
          />
          <select
            value={newEmployee.batch_id}
            onChange={(e) => setNewEmployee({ ...newEmployee, batch_id: e.target.value })}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.category})
              </option>
            ))}
          </select>
          <button type="submit">Add Employee</button>
        </form>
      </section>

      <section>
        <h2>All Batches</h2>
        <ul>
          {batches.map((b) => (
            <li key={b.id}>
              <strong>{b.name}</strong> — {b.category} (Owner: {b.owner_username || 'N/A'})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>All Employees</h2>
        <ul>
          {employees.map((e) => (
            <li key={e.id}>
              {e.name} ({e.username}) — Batch ID: {e.batch_id}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
