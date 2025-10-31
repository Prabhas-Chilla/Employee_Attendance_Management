import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'
export default function Home(){
  const nav = useNavigate();
  return (
    <div className="home-container">
      <h1>EMPLOYEE ATTENDANCE</h1>
      <div className="role-container">
        <div className="role-card">
          <div className="icon">👤</div>
          <h3>Admin</h3>
          <p>Add batches and employees</p>
          <button onClick={()=>nav('/login?role=admin')}>Login</button>
        </div>
        <div className="role-card">
          <div className="icon">👥</div>
          <h3>Batch Owner</h3>
          <p>Access your batch</p>
          <button onClick={()=>nav('/login?role=batch_owner')}>Login</button>
        </div>
        <div className="role-card">
          <div className="icon">🧑‍💼</div>
          <h3>Employee</h3>
          <p>View attendance</p>
          <button onClick={()=>nav('/login?role=employee')}>Login</button>
        </div>
      </div>
    </div>
  );
}
