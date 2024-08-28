import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { FaPlus, FaMinus } from 'react-icons/fa';

const ManageLoans = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('group-loan');
  const [guarantors, setGuarantors] = useState([{ id: 1 }]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFormToggle = (form) => {
    setActiveForm(form);
  };

  const addGuarantor = () => {
    setGuarantors([...guarantors, { id: guarantors.length + 1 }]);
  };

  const removeGuarantor = (id) => {
    setGuarantors(guarantors.filter(guarantor => guarantor.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/manage-loans" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Manage Loans</h2>
            <div className="flex space-x-4 mb-8">
              <button
                className={`px-4 py-2 rounded ${activeForm === 'group-loan' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                onClick={() => handleFormToggle('group-loan')}
              >
                Group Loan
              </button>
              <button
                className={`px-4 py-2 rounded ${activeForm === 'longterm-loan' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                onClick={() => handleFormToggle('longterm-loan')}
              >
                Long-term Loan
              </button>
              <button
                className={`px-4 py-2 rounded ${activeForm === 'shortterm-loan' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                onClick={() => handleFormToggle('shortterm-loan')}
              >
                Short-term/Advance Loan
              </button>
            </div>
            {activeForm === 'group-loan' && (
              <form id="group-loan-form" action="recordgrouploan.php" method="POST">
                <label htmlFor="group-name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="group-name" name="group-name" className="mb-4 p-2 border rounded w-full text-black" required>
                  <option value="">Select a Group</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="group-loan-amount" className="block text-black font-medium mb-2">Loan Amount</label>
                <input type="number" id="group-loan-amount" name="group-loan-amount" className="mb-4 p-2 border rounded w-full text-black" required />

                <label htmlFor="group-period" className="block text-black font-medium mb-2">Period (months)</label>
                <input type="number" id="group-period" name="group-period" className="mb-4 p-2 border rounded w-full text-black" step="0.01" required />

                <label htmlFor="company-payout" className="block text-black font-medium mb-2">Company Payout</label>
                <input type="number" id="company-payout" name="company-payout" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="group-interest-amount" className="block text-black font-medium mb-2">Interest Amount</label>
                <input type="number" id="group-interest-amount" name="group-interest-amount" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="group-date-issued" className="block text-black font-medium mb-2">Date Issued</label>
                <input type="text" id="group-date-issued" name="group-date-issued" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <label htmlFor="group-date-to-repay" className="block text-black font-medium mb-2">Date to Repay</label>
                <input type="text" id="group-date-to-repay" name="group-date-to-repay" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Submit Group Loan</button>
              </form>
            )}
            {activeForm === 'longterm-loan' && (
              <form id="longterm-loan-form" action="recordlongtermloan.php" method="POST">
                <label htmlFor="longterm-group-name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="longterm-group-name" name="longterm-group-name" className="mb-4 p-2 border rounded w-full text-black" required>
                  <option value="">Select a Group</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="longterm-member-name" className="block text-black font-medium mb-2">Member Name</label>
                <select id="longterm-member-name" name="longterm-member-name" className="mb-4 p-2 border rounded w-full text-black" required>
                  <option value="">Select a Member</option>
                  {/* Options populated dynamically */}
                </select>

                <div id="longterm-guarantors">
                  {guarantors.map((guarantor) => (
                    <div key={guarantor.id} className="mb-4">
                      <label htmlFor={`longterm-guarantor-name-${guarantor.id}`} className="block text-black font-medium mb-2">Guarantor Name</label>
                      <input type="text" id={`longterm-guarantor-name-${guarantor.id}`} name="longterm-guarantor-name[]" className="mb-2 p-2 border rounded w-full text-black" />

                      <label htmlFor={`longterm-guarantor-group-${guarantor.id}`} className="block text-black font-medium mb-2">Guarantor Group</label>
                      <input type="text" id={`longterm-guarantor-group-${guarantor.id}`} name="longterm-guarantor-group[]" className="mb-2 p-2 border rounded w-full text-black" />

                      <button
                        type="button"
                        onClick={() => removeGuarantor(guarantor.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded mt-2 flex items-center"
                      >
                        <FaMinus className="mr-2" /> Remove Guarantor
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGuarantor}
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center mt-2"
                  >
                    <FaPlus className="mr-2" /> Add Guarantor
                  </button>
                </div>

                <label htmlFor="longterm-loan-amount" className="block text-black font-medium mb-2">Loan Amount</label>
                <input type="number" id="longterm-loan-amount" name="longterm-loan-amount" className="mb-4 p-2 border rounded w-full text-black" required />

                <label htmlFor="longterm-period" className="block text-black font-medium mb-2">Period (months)</label>
                <input type="number" id="longterm-period" name="longterm-period" className="mb-4 p-2 border rounded w-full text-black" step="0.01" required />

                <label htmlFor="longterm-interest-amount" className="block text-black font-medium mb-2">Interest Amount</label>
                <input type="number" id="longterm-interest-amount" name="longterm-interest-amount" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="longterm-loan-form-fee" className="block text-black font-medium mb-2">Loan Form Fee</label>
                <input type="number" id="longterm-loan-form-fee" name="longterm-loan-form-fee" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="longterm-date-issued" className="block text-black font-medium mb-2">Date Issued</label>
                <input type="text" id="longterm-date-issued" name="longterm-date-issued" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <label htmlFor="longterm-date-to-repay" className="block text-black font-medium mb-2">Date to Repay</label>
                <input type="text" id="longterm-date-to-repay" name="longterm-date-to-repay" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Submit Long-term Loan</button>
              </form>
            )}
            {activeForm === 'shortterm-loan' && (
              <form id="shortterm-loan-form" action="recordshorttermloan.php" method="POST">
                <label htmlFor="shortterm-group-name" className="block text-black font-medium mb-2">Group Name</label>
                <select id="shortterm-group-name" name="shortterm-group-name" className="mb-4 p-2 border rounded w-full text-black" required>
                  <option value="">Select a Group</option>
                  {/* Options populated dynamically */}
                </select>

                <label htmlFor="shortterm-member-name" className="block text-black font-medium mb-2">Member Name</label>
                <select id="shortterm-member-name" name="shortterm-member-name" className="mb-4 p-2 border rounded w-full text-black" required>
                  <option value="">Select a Member</option>
                  {/* Options populated dynamically */}
                </select>

                <div id="shortterm-guarantors">
                  {guarantors.map((guarantor) => (
                    <div key={guarantor.id} className="mb-4">
                      <label htmlFor={`shortterm-guarantor-name-${guarantor.id}`} className="block text-black font-medium mb-2">Guarantor Name</label>
                      <input type="text" id={`shortterm-guarantor-name-${guarantor.id}`} name="shortterm-guarantor-name[]" className="mb-2 p-2 border rounded w-full text-black" />

                      <label htmlFor={`shortterm-guarantor-group-${guarantor.id}`} className="block text-black font-medium mb-2">Guarantor Group</label>
                      <input type="text" id={`shortterm-guarantor-group-${guarantor.id}`} name="shortterm-guarantor-group[]" className="mb-2 p-2 border rounded w-full text-black" />

                      <button
                        type="button"
                        onClick={() => removeGuarantor(guarantor.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded mt-2 flex items-center"
                      >
                        <FaMinus className="mr-2" /> Remove Guarantor
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGuarantor}
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center mt-2"
                  >
                    <FaPlus className="mr-2" /> Add Guarantor
                  </button>
                </div>

                <label htmlFor="shortterm-loan-amount" className="block text-black font-medium mb-2">Loan Amount</label>
                <input type="number" id="shortterm-loan-amount" name="shortterm-loan-amount" className="mb-4 p-2 border rounded w-full text-black" required />

                <label htmlFor="shortterm-period" className="block text-black font-medium mb-2">Period (months)</label>
                <input type="number" id="shortterm-period" name="shortterm-period" className="mb-4 p-2 border rounded w-full text-black" step="0.01" required />

                <label htmlFor="shortterm-interest-amount" className="block text-black font-medium mb-2">Interest Amount</label>
                <input type="number" id="shortterm-interest-amount" name="shortterm-interest-amount" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="shortterm-loan-form-fee" className="block text-black font-medium mb-2">Loan Form Fee</label>
                <input type="number" id="shortterm-loan-form-fee" name="shortterm-loan-form-fee" className="mb-4 p-2 border rounded w-full text-black" readOnly />

                <label htmlFor="shortterm-date-issued" className="block text-black font-medium mb-2">Date Issued</label>
                <input type="text" id="shortterm-date-issued" name="shortterm-date-issued" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <label htmlFor="shortterm-date-to-repay" className="block text-black font-medium mb-2">Date to Repay</label>
                <input type="text" id="shortterm-date-to-repay" name="shortterm-date-to-repay" className="mb-4 p-2 border rounded w-full text-black flatpickr" required />

                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Submit Short-term Loan</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageLoans;


