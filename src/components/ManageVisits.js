import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getGroupsAndMembers, recordVisit } from '../utils/visitsUtil';
import Notification from './Notification'; // Import the Notification component

const ManageVisits = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [tableData, setTableData] = useState([]);
  const [visitData, setVisitData] = useState({
    date: '',
    time: '',
    nextVisitDate: ''
  });
  const [notification, setNotification] = useState(null);

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
        status: ''
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/manage-visits" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Manage Visits</h2>
            <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="group_name" className="block text-black font-medium mb-2">Group Name</label>
                <select
                  id="group_name"
                  name="group_name"
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
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="p-2 border">Member Names</th>
                    <th className="p-2 border">Total Loan Given</th>
                    <th className="p-2 border">Loan B/F</th>
                    <th className="p-2 border">Shares B/F</th>
                    <th className="p-2 border">Total Repaid</th>
                    <th className="p-2 border">Principal</th>
                    <th className="p-2 border">Loan Interest</th>
                    <th className="p-2 border">Shares/Savings This Month</th>
                    <th className="p-2 border">INS</th>
                    <th className="p-2 border">Shares/Savings C/F</th>
                    <th className="p-2 border">Loan C/F</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={row.memberName}
                          onChange={(e) => handleInputChange(index, 'memberName', e.target.value)}
                          className="w-full p-1 text-black"
                          readOnly
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.totalLoanGiven}
                          onChange={(e) => handleInputChange(index, 'totalLoanGiven', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.loanBF}
                          onChange={(e) => handleInputChange(index, 'loanBF', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.sharesBF}
                          onChange={(e) => handleInputChange(index, 'sharesBF', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.totalRepaid}
                          onChange={(e) => handleInputChange(index, 'totalRepaid', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.principal}
                          onChange={(e) => handleInputChange(index, 'principal', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.loanInterest}
                          onChange={(e) => handleInputChange(index, 'loanInterest', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.sharesSavingsThisMonth}
                          onChange={(e) => handleInputChange(index, 'sharesSavingsThisMonth', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.ins}
                          onChange={(e) => handleInputChange(index, 'ins', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.sharesSavingsCF}
                          onChange={(e) => handleInputChange(index, 'sharesSavingsCF', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={row.loanCF}
                          onChange={(e) => handleInputChange(index, 'loanCF', e.target.value)}
                          className="w-full p-1 text-black"
                        />
                      </td>
                      <td className="p-2 border">
                        <select
                          value={row.status}
                          onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                          className="w-full p-1 text-black"
                        >
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                      </td>
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
