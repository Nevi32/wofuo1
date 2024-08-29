import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import RegisterMember from './components/RegisterMember';
import ManageSavings from './components/ManageSavings';
import ManageLoans from './components/ManageLoans';
import ManageVisits from './components/ManageVisits';
import MembersPage from './components/MembersPage';
import GroupPage from './components/GroupPage';
import SavingsPage from './components/SavingsPage';
import LoanPage from './components/LoanPages';
import VisitsPage from './components/VisitsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-member" element={<RegisterMember />} />
        <Route path="/manage-savings" element={<ManageSavings />} />
        <Route path="/manage-loans" element={<ManageLoans />} />
        <Route path="/manage-visits" element={<ManageVisits />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/loans" element={<LoanPage />} />
        <Route path="/visits" element={<VisitsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
