import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ email, toggleSidebar }) => {
  const userInitials = email.split('@')[0].substring(0, 2).toUpperCase();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 text-xl font-semibold lg:ml-0">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-4 hidden sm:inline">{email}</span>
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
              {userInitials}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
