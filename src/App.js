import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CreateGroup from './components/CreateGroup';
import RegisterMember from './components/RegisterMember';
import ManageSavings from './components/ManageSavings';
import ManageLoans from './components/ManageLoans';
import ManageVisits from './components/ManageVisits';
import ManageMembers from './components/ManageMembers';
import './App.css';

function App() {
  const userEmail = "johnnemo@gmail.com"; // This should be dynamically set based on the logged-in user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard email={userEmail} />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/register-member" element={<RegisterMember />} />
        <Route path="/manage-savings" element={<ManageSavings />} />
        <Route path="/manage-loans" element={<ManageLoans />} />
        <Route path="/manage-visits" element={<ManageVisits />} />
        <Route path="/manage-members" element={<ManageMembers />} />
        {/* Add routes for other sidebar items if needed */}
      </Routes>
    </Router>
  );
}

export default App;
