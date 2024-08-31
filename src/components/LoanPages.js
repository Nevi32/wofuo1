import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';
import { fetchAllLoans, updateLoan, fetchDefaulterInfo, fetchContinuingPayments, getLoanSummary } from '../utils/loansUtil';

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
      const loansWithSummary = await Promise.all(allLoans.map(async (loan) => {
        const summary = await getLoanSummary(loan.id);
        return { ...loan, ...summary };
      }));
      setLoans(loansWithSummary);
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

  const handleLoanClick = async (loan) => {
    const defaulterInfo = await fetchDefaulterInfo(loan.id);
    const continuingPayments = await fetchContinuingPayments(loan.id);
    setSelectedLoan({ ...loan, defaulterInfo, continuingPayments });
    setEditingLoanInfo(false);
  };

  const handleClosePopup = () => {
    setSelectedLoan(null);
    setEditingLoanInfo(false);
  };

  const handleEditLoanInfo = () => {
    setEditingLoanInfo(true);
  };

  const handleSaveLoanInfo = async (updatedLoan) => {
    try {
      const savedLoan = await updateLoan(updatedLoan);
      setLoans(loans.map(loan => 
        loan.id === savedLoan.id ? { ...savedLoan, ...updatedLoan } : loan
      ));
      setSelectedLoan({ ...savedLoan, ...updatedLoan });
      setEditingLoanInfo(false);
    } catch (error) {
      console.error('Failed to update loan:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const renderLoanDetails = (loan) => {
    const details = [
      { label: 'Name', value: loan.name },
      { label: 'Amount', value: loan.amount, prefix: 'KSH ' },
      { label: 'Term', value: loan.term },
      { label: 'Interest', value: loan.interest, prefix: 'KSH ' },
      { label: 'Status', value: loan.status },
      { label: 'Date Issued', value: loan.dateIssued },
      { label: 'Date to Repay', value: loan.dateToRepay },
      { label: 'Company Payout', value: loan.companyPayout, prefix: 'KSH ' },
      { label: 'Loan Form Fee', value: loan.loanFormFee, prefix: 'KSH ' },
      { label: 'Amount to Repay', value: loan.amountToRepay, prefix: 'KSH ' },
      { label: 'Total Repaid', value: loan.totalRepaid, prefix: 'KSH ' },
      { label: 'Remaining Balance', value: loan.remainingBalance, prefix: 'KSH ' },
    ];

    return details.map(({ label, value, prefix = '' }) => 
      value !== undefined && (
        <li key={label} className="flex justify-between items-center">
          <span className="text-black">{label}:</span>
          <span className="text-gray-600">{prefix}{value}</span>
        </li>
      )
    );
  };

  const renderEditableLoanDetails = (loan, setLoan) => {
    const details = [
      { label: 'Name', value: 'name' },
      { label: 'Amount', value: 'amount', prefix: 'KSH ' },
      { label: 'Term', value: 'term' },
      { label: 'Interest', value: 'interest', prefix: 'KSH ' },
      { label: 'Status', value: 'status' },
      { label: 'Date Issued', value: 'dateIssued', type: 'date' },
      { label: 'Date to Repay', value: 'dateToRepay', type: 'date' },
      { label: 'Company Payout', value: 'companyPayout', prefix: 'KSH ' },
      { label: 'Loan Form Fee', value: 'loanFormFee', prefix: 'KSH ' },
    ];

    return details.map(({ label, value, prefix = '', type = 'text' }) => 
      loan[value] !== undefined && (
        <div key={label} className="mb-4">
          <label className="block text-black font-semibold">{label}</label>
          <input
            type={type}
            value={loan[value]}
            onChange={(e) => setLoan({ ...loan, [value]: e.target.value })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
      )
    );
  };

  const renderDefaulterInfo = (defaulterInfo) => {
    if (!defaulterInfo || defaulterInfo.length === 0) {
      return <p>No defaulter information available.</p>;
    }

    return (
      <ul className="list-disc pl-5">
        {defaulterInfo.map((info, index) => (
          <li key={index} className="text-gray-600">
            {info.date}: {info.description}
          </li>
        ))}
      </ul>
    );
  };

  const renderContinuingPayments = (continuingPayments) => {
    if (!continuingPayments || continuingPayments.length === 0) {
      return <p>No continuing payments recorded.</p>;
    }

    return (
      <ul className="list-disc pl-5">
        {continuingPayments.map((payment, index) => (
          <li key={index} className="text-gray-600">
            {payment.date}: KSH {payment.amount}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/loans" />
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedLoan ? 'blur-sm' : ''}`}>
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
                  <h3 className="font-bold text-black mb-2">ID: {loan.id}</h3>
                  <p className="text-sm text-gray-600 mb-2">Name: {loan.name}</p>
                  <p className="text-sm text-gray-600 mb-2">Amount: KSH {loan.amount}</p>
                  <p className="text-sm text-gray-600 mb-2">Term: {loan.term}</p>
                  <p className="text-sm text-gray-600 mb-2">Status: {loan.status}</p>
                  <p className="text-sm text-gray-600 mb-2">Remaining: KSH {loan.remainingBalance}</p>
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
              <h3 className="text-lg font-bold text-black">Loan ID: {selectedLoan.id}</h3>
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
                {renderEditableLoanDetails(selectedLoan, setSelectedLoan)}
                {selectedLoan.guarantors && (
                  <div>
                    <label className="block text-black font-semibold">Guarantors</label>
                    {selectedLoan.guarantors.map((guarantor, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={guarantor.name}
                          onChange={(e) => {
                            const newGuarantors = [...selectedLoan.guarantors];
                            newGuarantors[index].name = e.target.value;
                            setSelectedLoan({ ...selectedLoan, guarantors: newGuarantors });
                          }}
                          className="flex-1 p-2 border rounded text-black"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={guarantor.group}
                          onChange={(e) => {
                            const newGuarantors = [...selectedLoan.guarantors];
                            newGuarantors[index].group = e.target.value;
                            setSelectedLoan({ ...selectedLoan, guarantors: newGuarantors });
                          }}
                          className="flex-1 p-2 border rounded text-black"
                          placeholder="Group"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="space-y-2">
                  {renderLoanDetails(selectedLoan)}
                  {selectedLoan.guarantors && selectedLoan.guarantors.length > 0 && (
                    <li className="flex flex-col">
                      <span className="text-black font-semibold mb-1">Guarantors:</span>
                      <ul className="list-disc pl-5">
                        {selectedLoan.guarantors.map((guarantor, index) => (
                          <li key={index} className="text-gray-600">
                            {guarantor.name} ({guarantor.group})
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
                <div>
                  <h4 className="text-black font-semibold mb-1">Defaulter Information:</h4>
                  {renderDefaulterInfo(selectedLoan.defaulterInfo)}
                </div>
                <div>
                  <h4 className="text-black font-semibold mb-1">Continuing Payments:</h4>
                  {renderContinuingPayments(selectedLoan.continuingPayments)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;