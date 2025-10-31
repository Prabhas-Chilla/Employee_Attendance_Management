import React, {useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { setToken, setUser } from '../services/auth';
export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [params] = useSearchParams();
  const roleParam = params.get('role') || 'employee';
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password, role: roleParam });
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'batch_owner') navigate('/owner');
      else navigate('/employee');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login ({roleParam})</h2>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        {msg && <p className="error">{msg}</p>}
      </div>
    </div>
  );
}
