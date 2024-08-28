import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit, Trash } from 'lucide-react';

const MembersPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [members, setMembers] = useState([
    { id: 1, firstName: 'Lucy', lastName: 'Njeri', group: 'Group A', phone: '1234567890', email: 'lucy@example.com' },
    { id: 2, firstName: 'John', lastName: 'Doe', group: 'Group B', phone: '0987654321', email: 'john@example.com' },
    // Add more members as needed
  ]);

  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName} ${member.group}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleSave = () => {
    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
  };

  const handleInputChange = (field, value) => {
    setEditingMember({ ...editingMember, [field]: value });
  };

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Members</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or group..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredMembers.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{`${member.firstName} ${member.lastName}`}</h3>
                      <p className="text-sm text-gray-600">{member.group}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Phone: {member.phone}</p>
                  <p className="text-sm text-gray-600 mb-4">Email: {member.email}</p>
                  <div className="flex justify-end">
                    <button onClick={() => handleEdit(member)} className="text-purple-600 mr-2">
                      <Edit size={20} />
                    </button>
                    <button className="text-purple-600">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Edit Member</h3>
              <button onClick={() => setEditingMember(null)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={editingMember.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={editingMember.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="group" className="block text-sm font-medium text-gray-700">Group</label>
                <input
                  type="text"
                  id="group"
                  value={editingMember.group}
                  onChange={(e) => handleInputChange('group', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={editingMember.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editingMember.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;