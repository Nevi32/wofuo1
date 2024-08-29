import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';
import { fetchAllLoans } from '../utils/loansUtil';

const LoanPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingLoanInfo, setEditingLoanInfo] = useState(false);
  const [loanType, setLoanType] = useState('group');
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const loadLoans = async () => {
      const allLoans = await fetchAllLoans();
      setLoans(allLoans);
    };
    loadLoans();
  }, []);

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
    // TODO: Implement saving to local storage
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
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Loans</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLoans.map(loan => (
                <div key={loan.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{loan.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Amount: KSH {loan.amount}</p>
                  <p className="text-sm text-gray-600 mb-2">Term: {loan.term}</p>
                  <p className="text-sm text-gray-600 mb-2">Interest: {loan.interest}</p>
                  <p className="text-sm text-gray-600 mb-2">Status: {loan.status}</p>
                  <button
                    onClick={() => handleLoanClick(loan)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md w-full mt-2"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                  <span className="text-gray-600">KSH {selectedLoan.amount}</span>
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
                {selectedLoan.dateIssued && (
                  <li className="flex justify-between items-center">
                    <span className="text-black">Date Issued:</span>
                    <span className="text-gray-600">{selectedLoan.dateIssued}</span>
                  </li>
                )}
                {selectedLoan.dateToRepay && (
                  <li className="flex justify-between items-center">
                    <span className="text-black">Date to Repay:</span>
                    <span className="text-gray-600">{selectedLoan.dateToRepay}</span>
                  </li>
                )}
                {selectedLoan.companyPayout && (
                  <li className="flex justify-between items-center">
                    <span className="text-black">Company Payout:</span>
                    <span className="text-gray-600">KSH {selectedLoan.companyPayout}</span>
                  </li>
                )}
                {selectedLoan.guarantors && (
                  <li className="flex justify-between items-center">
                    <span className="text-black">Guarantors:</span>
                    <span className="text-gray-600">{selectedLoan.guarantors.join(', ')}</span>
                  </li>
                )}
                {selectedLoan.loanFormFee && (
                  <li className="flex justify-between items-center">
                    <span className="text-black">Loan Form Fee:</span>
                    <span className="text-gray-600">KSH {selectedLoan.loanFormFee}</span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;
