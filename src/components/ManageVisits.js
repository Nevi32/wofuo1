import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ManageVisits = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableData, setTableData] = useState([
    {
      memberName: 'John Doe',
      totalLoanGiven: '1000',
      loanBF: '500',
      sharesBF: '200',
      totalRepaid: '300',
      principal: '250',
      loanInterest: '50',
      sharesSavingsThisMonth: '100',
      ins: '20',
      sharesSavingsCF: '300',
      loanCF: '700',
      status: 'Active'
    },
    // Add more initial rows as needed
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleInputChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/manage-visits" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Manage Visits</h2>
            <form className="mb-8 space-y-4">
              <div>
                <label htmlFor="group_name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="group_name" name="group_name" className="w-full p-2 border rounded text-black" required>
                  <option value="">Select a Group</option>
                  {/* Options will be populated dynamically */}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-black font-medium mb-2">Visit Date</label>
                <input type="date" id="date" name="date" className="w-full p-2 border rounded text-black" required />
              </div>
              <div>
                <label htmlFor="time" className="block text-black font-medium mb-2">Visit Time</label>
                <input type="time" id="time" name="time" className="w-full p-2 border rounded text-black" required />
              </div>
              <div>
                <label htmlFor="next_visit" className="block text-black font-medium mb-2">Next Visit Date</label>
                <input type="date" id="next_visit" name="next_visit" className="w-full p-2 border rounded text-black" required />
              </div>
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
    </div>
  );
};

export default ManageVisits;