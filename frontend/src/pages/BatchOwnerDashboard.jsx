import React, {useEffect, useState} from 'react';
import API from '../services/api';
import { getUser, clearAuth } from '../services/auth';
import '../styles/styles.css'
export default function BatchOwnerDashboard(){
  const user = getUser();
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState('');
  useEffect(()=>{ if(user && user.batch_id) loadEmployees(); }, []);
  async function loadEmployees(){ 
    const res = await API.get('/employees'); setEmployees(res.data);
   }
  async function save(empId, status){ const payload = { attendance_date: date || new Date().toISOString().slice(0,10), batch_id: user.batch_id, records: [{ employee_id: empId, status }] }; await API.post('/attendance', payload); alert('Saved'); }
  function logout(){ 
    clearAuth(); window.location.href = '/'; 
  }
  return (
    <div className="dashboard owner-page">
      <header><h1>Batch Owner Dashboard</h1><button onClick={logout}>Logout</button></header>
      <div><label>Date: <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label></div>
      <table><thead><tr><th>Name</th><th>Batch</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{employees.map(emp=>(<tr key={emp.id}><td>{emp.name}</td><td>{emp.batch_name}</td><td><select id={'s-'+emp.id}><option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option></select></td><td><button onClick={()=>{ const s=document.getElementById('s-'+emp.id).value; save(emp.id, s); }}>Save</button></td></tr>))}</tbody></table>
    </div>
  );
}
