import React, {useEffect, useState} from 'react';
import API from '../services/api';
import { getUser, clearAuth } from '../services/auth';
import '../styles/styles.css'
export default function EmployeeDashboard(){ 
  const user = getUser();
  const [history, setHistory] = useState([]);
  useEffect(()=>{ if(user) loadHistory(user.id || user.ref_id); }, []);
  async function loadHistory(id){ 
    const res = await API.get(`/attendance/history/${id}`); setHistory(res.data);
   }
  function logout(){ clearAuth(); window.location.href = '/'; }
  return (
    <div className="dashboard emp-page">
      <header><h1>Employee Attendance</h1><button onClick={logout}>Logout</button></header>
      <table><thead><tr><th>Date</th><th>Status</th><th>Batch</th></tr></thead>
      <tbody>{history.map((h,i)=><tr key={i}><td>{h.date}</td><td>{h.status}</td><td>{h.batch}</td></tr>)}</tbody></table>
    </div>
  );
}
