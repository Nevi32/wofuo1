import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit, Trash } from 'lucide-react';
import { getMembers, updateMember } from '../utils/membersutil'; // Adjust the import path as necessary

const MembersPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [members, setMembers] = useState([]);

  const location = useLocation();

  useEffect(() => {
    // Fetch members data when the component mounts
    const fetchMembers = async () => {
      const memberData = await getMembers(); // Fetch data from utility
      setMembers(memberData);
    };
    
    fetchMembers();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    `${member.fullName} ${member.groupName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleSave = async () => {
    // Save updated member data
    await updateMember(editingMember); // Update localStorage
    setMembers(members.map(m => m.nationalId === editingMember.nationalId ? editingMember : m));
    setEditingMember(null);
  };

  const handleInputChange = (field, value) => {
    setEditingMember({ ...editingMember, [field]: value });
  };

  const getInitials = (fullName) => {
    const names = fullName.split(' ');
    if (names.length < 2) return fullName.charAt(0).toUpperCase(); // Handle cases with less than 2 names
    return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} className={`fixed inset-y-0 left-0 w-64 z-50 ${sidebarOpen ? 'block' : 'hidden'}`} />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-transform duration-300 ${sidebarOpen ? 'transform translate-x-64' : ''}`}>
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
                <div key={member.nationalId} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {getInitials(member.fullName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{member.fullName}</h3>
                      <p className="text-sm text-gray-600">{member.groupName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Phone: {member.phoneNumber}</p>
                  <p className="text-sm text-gray-600 mb-2">Location: {member.location}</p>
                  <p className="text-sm text-gray-600 mb-2">County: {member.county}</p>
                  <p className="text-sm text-gray-600 mb-2">Date of Birth: {member.dateOfBirth}</p>
                  <p className="text-sm text-gray-600 mb-2">Member Status: {member.memberStatus}</p>
                  <p className="text-sm text-gray-600 mb-2">Sub-County: {member.subCounty}</p>
                  <p className="text-sm text-gray-600 mb-2">Village: {member.village}</p>
                  <p className="text-sm text-gray-600 mb-4">Ward: {member.ward}</p>
                  <h4 className="font-semibold text-gray-800 mb-2">Next of Kin</h4>
                  <p className="text-sm text-gray-600 mb-2">Full Name: {member.nextOfKinFullName}</p>
                  <p className="text-sm text-gray-600 mb-2">ID Number: {member.nextOfKinIdNumber}</p>
                  <p className="text-sm text-gray-600 mb-2">Phone Number: {member.nextOfKinPhoneNumber}</p>
                  <p className="text-sm text-gray-600 mb-4">Relationship: {member.nextOfKinRelationship}</p>
                  <h4 className="font-semibold text-gray-800 mb-2">Fees</h4>
                  <p className="text-sm text-gray-600 mb-2">Next of Kin Form Fee: {member.nextOfKinFormFee}</p>
                  <p className="text-sm text-gray-600 mb-2">Passbook Fee: {member.passbookFee}</p>
                  <p className="text-sm text-gray-600 mb-4">Registration Fee: {member.registrationFee}</p>
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
              {/* Form fields for editing */}
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={editingMember.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={editingMember.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  value={editingMember.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
                <input
                  type="text"
                  id="county"
                  value={editingMember.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-black"
                />
              </div>
              {/* Add more fields as needed */}
              <div className="flex justify-end">
                <button type="button" onClick={() => setEditingMember(null)} className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;





