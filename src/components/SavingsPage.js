import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';
import { getTotalSavings, getWithdrawals, getMemberSavings, getMemberWithdrawals } from '../utils/savingWithdawlUtil';

const SavingsPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(false);
  const [savings, setSavings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [viewType, setViewType] = useState('savings');
  const [memberTransactions, setMemberTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savingsData, withdrawalsData] = await Promise.all([getTotalSavings(), getWithdrawals()]);
        setSavings(savingsData);
        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = (viewType === 'savings' ? savings : withdrawals).filter(item =>
    item.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setEditingItem(false);
    try {
      if (viewType === 'savings') {
        const memberSavings = await getMemberSavings(item.groupName, item.memberName);
        setMemberTransactions(memberSavings);
      } else {
        const memberWithdrawals = await getMemberWithdrawals(item.groupName, item.memberName);
        setMemberTransactions(memberWithdrawals);
      }
    } catch (error) {
      console.error("Failed to fetch member transactions:", error);
    }
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setEditingItem(false);
    setMemberTransactions([]);
  };

  const handleEditItem = () => {
    setEditingItem(true);
  };

  const handleSaveItem = (newData) => {
    // TODO: Implement saving edited data
    setEditingItem(false);
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
            <h2 className="text-2xl font-bold mb-4 text-black">Savings & Withdrawals</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by group or member name..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex mb-4">
              <button
                onClick={() => setViewType('savings')}
                className={`bg-purple-600 text-white px-4 py-2 rounded-md ${viewType === 'savings' ? 'bg-purple-700' : ''}`}
              >
                Savings
              </button>
              <button
                onClick={() => setViewType('withdrawals')}
                className={`bg-purple-600 text-white px-4 py-2 rounded-md ml-2 ${viewType === 'withdrawals' ? 'bg-purple-700' : ''}`}
              >
                Withdrawals
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{item.memberName}</h3>
                  <p className="text-sm text-gray-600 mb-2">Group: {item.groupName}</p>
                  {viewType === 'savings' ? (
                    <p className="text-sm text-gray-600 mb-2">Total Savings: {item.totalAmount}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Amount Withdrawn: {item.withdrawAmount}</p>
                      <p className="text-sm text-gray-600 mb-2">Date: {item.withdrawDate}</p>
                    </>
                  )}
                  <button
                    onClick={() => handleItemClick(item)}
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

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">{selectedItem.memberName}</h3>
              <div className="flex items-center">
                {editingItem ? (
                  <button
                    onClick={() => handleSaveItem(selectedItem)}
                    className="text-purple-600 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={handleEditItem} className="text-purple-600 mr-2">
                    <Edit size={20} />
                  </button>
                )}
                <button onClick={handleClosePopup} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            <h4 className="font-semibold text-black mb-2">Details:</h4>
            {viewType === 'savings' ? (
              <>
                <p className="text-black mb-2">Total Savings: {selectedItem.totalAmount}</p>
                <h5 className="font-semibold text-black mt-4 mb-2">Savings History:</h5>
                <ul className="space-y-2">
                  {memberTransactions.map((transaction, index) => (
                    <li key={index} className="border-b pb-2">
                      <p className="text-sm text-gray-600">Amount: {transaction.savingAmount}</p>
                      <p className="text-sm text-gray-600">Date: {transaction.savingDate}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h5 className="font-semibold text-black mt-4 mb-2">Withdrawal History:</h5>
                <ul className="space-y-2">
                  {memberTransactions.map((transaction, index) => (
                    <li key={index} className="border-b pb-2">
                      <p className="text-sm text-gray-600">Amount Withdrawn: {transaction.withdrawAmount}</p>
                      <p className="text-sm text-gray-600">Company Payout: {transaction.companyPayout}</p>
                      <p className="text-sm text-gray-600">Amount Given: {transaction.amountGiven}</p>
                      <p className="text-sm text-gray-600">Date: {transaction.withdrawDate}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsPage;

