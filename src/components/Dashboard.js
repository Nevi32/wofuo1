import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Retrieve user info from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/login'); // Redirect to login if no user info
    }
  }, [navigate]);

  const actionItems = [
    { title: 'Register New Member', description: 'Quickly add new members to the system.', path: '/register-member' },
    { title: 'Manage Savings', description: 'Track and manage member savings.', path: '/manage-savings' },
    { title: 'Manage Loans', description: 'Handle loan applications and repayments.', path: '/manage-loans' },
    { title: 'Manage Visits', description: 'Track and manage visits to groups.', path: '/manage-visits' },
    { title: 'Loan Track', description: 'Track loans and assign status.', path: '/loan-track' },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {user ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
                <p className="text-gray-600 mb-8">Your one-stop solution for managing financial records, members, and more.</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleCardClick(item.path)}
                >
                  <h3 className="text-lg font-semibold text-purple-700 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
