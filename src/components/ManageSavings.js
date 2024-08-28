import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ManageSavings = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('withdrawal');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFormToggle = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/manage-savings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Manage Savings</h2>
            <div className="flex space-x-4 mb-8">
              <button
                className={`px-4 py-2 rounded ${activeForm === 'withdrawal' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                onClick={() => handleFormToggle('withdrawal')}
              >
                Withdrawals
              </button>
              <button
                className={`px-4 py-2 rounded ${activeForm === 'savings' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                onClick={() => handleFormToggle('savings')}
              >
                Register Savings
              </button>
            </div>
            {activeForm === 'withdrawal' ? (
              <form id="withdraw-savings-form" action="recordwithdrawal.php" method="post">
                <label htmlFor="withdraw-group-name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="withdraw-group-name" name="group_name" className="mb-4 p-2 border rounded w-full" required>
                  <option value="">Select a Group</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="withdraw-member-name" className="block text-black font-medium mb-2">Member Name</label>
                <select id="withdraw-member-name" name="member_name" className="mb-4 p-2 border rounded w-full" required>
                  <option value="">Select a Member</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="withdraw-amount" className="block text-black font-medium mb-2">Withdrawal Amount</label>
                <input type="number" id="withdraw-amount" name="withdraw_amount" className="mb-4 p-2 border rounded w-full" required />

                <label htmlFor="company-payout" className="block text-black font-medium mb-2">Company Payout</label>
                <input type="number" id="company-payout" name="company_payout" className="mb-4 p-2 border rounded w-full" readOnly />

                <label htmlFor="amount-given" className="block text-black font-medium mb-2">Amount Given</label>
                <input type="number" id="amount-given" name="amount_given" className="mb-4 p-2 border rounded w-full" readOnly />

                <label htmlFor="withdraw-date" className="block text-black font-medium mb-2">Date</label>
                <input type="date" id="withdraw-date" name="saving_date" className="mb-4 p-2 border rounded w-full" required />

                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
              </form>
            ) : (
              <form id="register-savings-form" action="recordsavings.php" method="post">
                <label htmlFor="group-name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="group-name" name="group_name" className="mb-4 p-2 border rounded w-full" required>
                  <option value="">Select a Group</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="member-name" className="block text-black font-medium mb-2">Member Name</label>
                <select id="member-name" name="member_name" className="mb-4 p-2 border rounded w-full" required>
                  <option value="">Select a Member</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="saving-amount" className="block text-black font-medium mb-2">Saving Amount</label>
                <input type="number" id="saving-amount" name="saving_amount" className="mb-4 p-2 border rounded w-full" required />

                <label htmlFor="saving-date" className="block text-black font-medium mb-2">Saving Date</label>
                <input type="date" id="saving-date" name="saving_date" className="mb-4 p-2 border rounded w-full" required />

                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageSavings;




