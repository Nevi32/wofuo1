import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getGroupsAndMembers, recordVisit } from '../utils/visitsUtil';
import Notification from './Notification';

const ManageVisits = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [tableData, setTableData] = useState([]);
  const [visitData, setVisitData] = useState({
    date: '',
    time: '',
    nextVisitDate: '',
    groupName: ''
  });
  const [notification, setNotification] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      const groupData = await getGroupsAndMembers();
      setGroups(groupData);
    };

    fetchGroups();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleGroupChange = (e) => {
    const groupName = e.target.value;
    setSelectedGroup(groupName);
    setVisitData(prevState => ({ ...prevState, groupName }));

    const group = groups.find(group => group.groupName === groupName);

    if (group) {
      const membersData = group.members.map(memberName => ({
        memberName,
        totalLoanGiven: '',
        loanBF: '',
        sharesBF: '',
        totalRepaid: '',
        principal: '',
        loanInterest: '',
        sharesSavingsThisMonth: '',
        ins: '',
        sharesSavingsCF: '',
        loanCF: '',
        status: 'Active'  // Set default status to 'Active'
      }));

      setTableData(membersData);
    } else {
      setTableData([]);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  const handleVisitDataChange = (e) => {
    const { name, value } = e.target;
    setVisitData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordVisit(visitData, tableData);
      setNotification({
        message: 'Visit recorded successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Error recording visit. Please try again.',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleColumnResize = (columnName, newWidth) => {
    setColumnWidths(prevWidths => ({
      ...prevWidths,
      [columnName]: newWidth
    }));
  };

  const tableHeaders = [
    'Member Names', 'Total Loan Given', 'Loan B/F', 'Shares B/F', 'Total Repaid',
    'Principal', 'Loan Interest', 'Shares/Savings This Month', 'INS',
    'Shares/Savings C/F', 'Loan C/F', 'Status'
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/manage-visits" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 ${sidebarOpen ? 'ml-64' : ''}`}>
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Manage Visits</h2>
            <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="group_name" className="block text-black font-medium mb-2">Group Name</label>
                <select
                  id="group_name"
                  name="groupName"
                  className="w-full p-2 border rounded text-black"
                  value={selectedGroup}
                  onChange={handleGroupChange}
                  required
                >
                  <option value="">Select a Group</option>
                  {groups.map((group, index) => (
                    <option key={index} value={group.groupName}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-black font-medium mb-2">Visit Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={visitData.date}
                    onChange={handleVisitDataChange}
                    className="w-full p-2 border rounded text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-black font-medium mb-2">Visit Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={visitData.time}
                    onChange={handleVisitDataChange}
                    className="w-full p-2 border rounded text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="next_visit" className="block text-black font-medium mb-2">Next Visit Date</label>
                  <input
                    type="date"
                    id="next_visit"
                    name="nextVisitDate"
                    value={visitData.nextVisitDate}
                    onChange={handleVisitDataChange}
                    className="w-full p-2 border rounded text-black"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="p-2 border relative"
                        style={{ minWidth: columnWidths[header] || '150px' }}
                      >
                        {header}
                        <div
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                          onMouseDown={(e) => {
                            const startX = e.pageX;
                            const startWidth = columnWidths[header] || 150;
                            
                            const handleMouseMove = (moveEvent) => {
                              const newWidth = startWidth + (moveEvent.pageX - startX);
                              handleColumnResize(header, `${newWidth}px`);
                            };
                            
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove);
                              document.removeEventListener('mouseup', handleMouseUp);
                            };
                            
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                          }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(row).map((key, cellIndex) => (
                        <td key={cellIndex} className="p-2 border">
                          {key === 'memberName' ? (
                            <input
                              type="text"
                              value={row[key]}
                              onChange={(e) => handleInputChange(index, key, e.target.value)}
                              className="w-full p-1 text-black"
                              readOnly
                            />
                          ) : key === 'status' ? (
                            <select
                              value={row[key]}
                              onChange={(e) => handleInputChange(index, key, e.target.value)}
                              className="w-full p-1 text-black"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          ) : (
                            <input
                              type="number"
                              value={row[key]}
                              onChange={(e) => handleInputChange(index, key, e.target.value)}
                              className="w-full p-1 text-black"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default ManageVisits;