import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Group, Coins, FileText, BarChart2, Settings, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, text: 'Dashboard', path: '/dashboard' },
    { icon: Users, text: 'Members', path: '/members' },
    { icon: Group, text: 'Groups', path: '/groups' },
    { icon: Coins, text: 'Savings', path: '/manage-savings' },
    { icon: FileText, text: 'Loans', path: '/manage-loans' },
    { icon: BarChart2, text: 'Visits', path: '/manage-visits' },
    { icon: Settings, text: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-purple-700 text-white transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img src="/logo.jpeg" alt="WOFUO Logo" className="w-8 h-8" />
            </div>
            <span className="ml-2 text-xl font-bold">WOFUO</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 flex-1">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="px-2">
                <Link
                  to={item.path}
                  className={`flex items-center w-full px-2 py-3 text-sm font-medium rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-white ${
                    location.pathname === item.path ? 'bg-purple-800' : ''
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;