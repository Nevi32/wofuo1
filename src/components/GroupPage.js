import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';
import { getMembers } from '../utils/membersutil'; // Import the getMembers function

const GroupPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await getMembers();
        const groupedMembers = members.reduce((acc, member) => {
          const groupName = member.groupName || 'Unassigned';
          if (!acc[groupName]) {
            acc[groupName] = {
              id: acc.length + 1,
              name: groupName,
              memberCount: 0,
              members: []
            };
          }
          acc[groupName].members.push({
            name: member.fullName,
            status: member.memberStatus
          });
          acc[groupName].memberCount++;
          return acc;
        }, {});
        setGroups(Object.values(groupedMembers));
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    fetchMembers();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setEditingGroupName(false);
  };

  const handleClosePopup = () => {
    setSelectedGroup(null);
    setEditingGroupName(false);
  };

  const handleEditGroupName = () => {
    setEditingGroupName(true);
  };

  const handleSaveGroupName = (newName) => {
    setGroups(groups.map(g => 
      g.id === selectedGroup.id ? { ...g, name: newName } : g
    ));
    setSelectedGroup({ ...selectedGroup, name: newName });
    setEditingGroupName(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/groups" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Groups</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredGroups.map(group => (
                <div key={group.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Members: {group.memberCount}</p>
                  <button
                    onClick={() => handleGroupClick(group)}
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

      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              {editingGroupName ? (
                <input
                  type="text"
                  value={selectedGroup.name}
                  onChange={(e) => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                  className="text-lg font-bold text-black border-b-2 border-purple-600 focus:outline-none"
                />
              ) : (
                <h3 className="text-lg font-bold text-black">{selectedGroup.name}</h3>
              )}
              <div className="flex items-center">
                {editingGroupName ? (
                  <button
                    onClick={() => handleSaveGroupName(selectedGroup.name)}
                    className="text-purple-600 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={handleEditGroupName} className="text-purple-600 mr-2">
                    <Edit size={20} />
                  </button>
                )}
                <button onClick={handleClosePopup} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            <h4 className="font-semibold text-black mb-2">Members:</h4>
            <ul className="space-y-2">
              {selectedGroup.members.map((member, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-black">{member.name}</span>
                  <span className="text-sm text-gray-600">{member.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;


