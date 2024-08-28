import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';

const LoanPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingLoanInfo, setEditingLoanInfo] = useState(false);
  const [loanType, setLoanType] = useState('group');
  const [loans, setLoans] = useState([
    { id: 1, type: 'group', name: 'Group Loan A', amount: 5000, term: '12 months', interest: '5%', status: 'Approved' },
    { id: 2, type: 'long-term', name: 'Long-Term Loan B', amount: 10000, term: '24 months', interest: '7%', status: 'Pending' },
    { id: 3, type: 'short-term', name: 'Short-Term Loan C', amount: 3000, term: '6 months', interest: '4%', status: 'Approved' },
    // Add more loans as needed
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    setSelectedLoan(null);
  };

  const filteredLoans = loans.filter(loan => 
    loan.type === loanType && loan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoanClick = (loan) => {
    setSelectedLoan(loan);
    setEditingLoanInfo(false);
  };

  const handleClosePopup = () => {
    setSelectedLoan(null);
    setEditingLoanInfo(false);
  };

  const handleEditLoanInfo = () => {
    setEditingLoanInfo(true);
  };

  const handleSaveLoanInfo = (updatedLoan) => {
    setLoans(loans.map(loan => 
      loan.id === selectedLoan.id ? updatedLoan : loan
    ));
    setSelectedLoan(updatedLoan);
    setEditingLoanInfo(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/loans" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
            <h2 className="text-2xl font-bold mb-4 text-black">Loans</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-md text-white ${loanType === 'group' ? 'bg-purple-600' : 'bg-gray-400'}`}
                  onClick={() => handleLoanTypeChange('group')}
                >
                  Group Loans
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-white ${loanType === 'long-term' ? 'bg-purple-600' : 'bg-gray-400'}`}
                  onClick={() => handleLoanTypeChange('long-term')}
                >
                  Long-Term Loans
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-white ${loanType === 'short-term' ? 'bg-purple-600' : 'bg-gray-400'}`}
                  onClick={() => handleLoanTypeChange('short-term')}
                >
                  Short-Term Loans
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search loans..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredLoans.map(loan => (
                <div key={loan.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{loan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Amount: ${loan.amount}</p>
                  <p className="text-sm text-gray-600 mb-4">Term: {loan.term}</p>
                  <p className="text-sm text-gray-600 mb-4">Interest: {loan.interest}</p>
                  <p className="text-sm text-gray-600 mb-4">Status: {loan.status}</p>
                  <button
                    onClick={() => handleLoanClick(loan)}
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

      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-70">
            <div className="flex justify-between items-center mb-4">
              {editingLoanInfo ? (
                <input
                  type="text"
                  value={selectedLoan.name}
                  onChange={(e) => setSelectedLoan({ ...selectedLoan, name: e.target.value })}
                  className="text-lg font-bold text-black border-b-2 border-purple-600 focus:outline-none"
                />
              ) : (
                <h3 className="text-lg font-bold text-black">{selectedLoan.name}</h3>
              )}
              <div className="flex items-center">
                {editingLoanInfo ? (
                  <button
                    onClick={() => handleSaveLoanInfo(selectedLoan)}
                    className="text-purple-600 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={handleEditLoanInfo} className="text-purple-600 mr-2">
                    <Edit size={20} />
                  </button>
                )}
                <button onClick={handleClosePopup} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            {editingLoanInfo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-black font-semibold">Amount</label>
                  <input
                    type="number"
                    value={selectedLoan.amount}
                    onChange={(e) => setSelectedLoan({ ...selectedLoan, amount: e.target.value })}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold">Term</label>
                  <input
                    type="text"
                    value={selectedLoan.term}
                    onChange={(e) => setSelectedLoan({ ...selectedLoan, term: e.target.value })}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold">Interest</label>
                  <input
                    type="text"
                    value={selectedLoan.interest}
                    onChange={(e) => setSelectedLoan({ ...selectedLoan, interest: e.target.value })}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold">Status</label>
                  <input
                    type="text"
                    value={selectedLoan.status}
                    onChange={(e) => setSelectedLoan({ ...selectedLoan, status: e.target.value })}
                    className="w-full p-2 border rounded text-black"
                  />
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-black">Amount:</span>
                  <span className="text-gray-600">${selectedLoan.amount}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-black">Term:</span>
                  <span className="text-gray-600">{selectedLoan.term}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-black">Interest:</span>
                  <span className="text-gray-600">{selectedLoan.interest}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-black">Status:</span>
                  <span className="text-gray-600">{selectedLoan.status}</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;
