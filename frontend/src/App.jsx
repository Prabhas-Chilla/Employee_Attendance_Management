import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BatchOwnerDashboard from './pages/BatchOwnerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
export default function App(){ return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/admin' element={<AdminDashboard/>} />
      <Route path='/owner' element={<BatchOwnerDashboard/>} />
      <Route path='/employee' element={<EmployeeDashboard/>} />
    </Routes>
  </BrowserRouter>
);}
