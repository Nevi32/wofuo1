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
import './App.css';
import GroupPage from './components/GroupPage';
import SavingsPage from './components/SavingsPage';
import LoanPage from './components/LoanPages';
import VisitsPage from './components/VisitsPage';

function App() {
  // This should be dynamically set based on the logged-in user
  // For now, we'll use a dummy email. In a real app, this would come from your authentication system
  const userEmail = "johndoe@example.com";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard email={userEmail} />} />
        <Route path="/register-member" element={<RegisterMember email={userEmail} />} />
        <Route path="/manage-savings" element={<ManageSavings email={userEmail} />} />
        <Route path="/manage-loans" element={<ManageLoans email={userEmail} />} />
        <Route path="/manage-visits" element={<ManageVisits email={userEmail} />} />
        <Route path="/members" element={<MembersPage email={userEmail} />} />
        <Route path="/groups" element={<GroupPage email={userEmail} />} />
        <Route path="/savings" element={<SavingsPage email={userEmail} />} />
        <Route path="/loans" element={<LoanPage email={userEmail} />} />
        <Route path="/visits" element={<VisitsPage email={userEmail} />} />
      </Routes>
    </Router>
  );
}

export default App;
