import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';

const SavingsPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUserName, setEditingUserName] = useState(false);
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      savings: 1500, 
      withdrawals: 300 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      savings: 2500, 
      withdrawals: 400 
    },
    // Add more users as needed
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setEditingUserName(false);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
    setEditingUserName(false);
  };

  const handleEditUserName = () => {
    setEditingUserName(true);
  };

  const handleSaveUserName = (newName) => {
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, name: newName } : u
    ));
    setSelectedUser({ ...selectedUser, name: newName });
    setEditingUserName(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/savings" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Savings</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Savings: ${user.savings}</p>
                  <p className="text-sm text-gray-600 mb-4">Withdrawals: ${user.withdrawals}</p>
                  <button
                    onClick={() => handleUserClick(user)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md w-full"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              {editingUserName ? (
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="text-lg font-bold text-black border-b-2 border-purple-600 focus:outline-none"
                />
              ) : (
                <h3 className="text-lg font-bold text-black">{selectedUser.name}</h3>
              )}
              <div className="flex items-center">
                {editingUserName ? (
                  <button
                    onClick={() => handleSaveUserName(selectedUser.name)}
                    className="text-purple-600 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={handleEditUserName} className="text-purple-600 mr-2">
                    <Edit size={20} />
                  </button>
                )}
                <button onClick={handleClosePopup} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-black mb-2"><strong>Savings:</strong> ${selectedUser.savings}</p>
              <p className="text-black mb-2"><strong>Withdrawals:</strong> ${selectedUser.withdrawals}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsPage;
