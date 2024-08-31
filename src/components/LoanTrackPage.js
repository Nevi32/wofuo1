import React, { useState, useEffect } from 'react';
import { 
  recordDefaulter, 
  recordContinuingPayment, 
  fetchAllLoans,
  fetchDefaulterInfo,
  fetchContinuingPayments,
  removeDefaulterStatus
} from '../utils/loansUtil';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Notification from './Notification';

const TractLoansPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [defaulterInfo, setDefaulterInfo] = useState([]);
  const [continuingPayments, setContinuingPayments] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const allLoans = await fetchAllLoans();
      setLoans(allLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setNotification({ message: 'Error fetching loans.', type: 'error' });
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFormToggle = (form) => {
    setActiveForm(form);
    setSelectedLoan(null);
    setDefaulterInfo([]);
    setContinuingPayments([]);
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const handleLoanSelect = async (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    setSelectedLoan(loan);

    try {
      const defaulters = await fetchDefaulterInfo(loanId);
      setDefaulterInfo(defaulters);

      const payments = await fetchContinuingPayments(loanId);
      setContinuingPayments(payments);
    } catch (error) {
      console.error('Error fetching loan details:', error);
      setNotification({ message: 'Error fetching loan details.', type: 'error' });
    }
  };

  const handleDefaulterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const result = await recordDefaulter(
        selectedLoan.id,
        formData.get('defaulter-description')
      );
      console.log('Defaulter submitted:', result);
      setNotification({ message: 'Defaulter information recorded successfully!', type: 'success' });
      fetchLoans();
      handleLoanSelect(selectedLoan.id);
    } catch (error) {
      console.error('Error recording defaulter:', error);
      setNotification({ message: 'Error recording defaulter information.', type: 'error' });
    }
  };

  const handleContinuingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const result = await recordContinuingPayment(
        selectedLoan.id,
        formData.get('continuing-new-payment'),
        formData.get('continuing-payment-date')
      );
      console.log('Continuing loan payment submitted:', result);
      setNotification({ message: 'Continuing loan payment recorded successfully!', type: 'success' });
      fetchLoans();
      handleLoanSelect(selectedLoan.id);
    } catch (error) {
      console.error('Error recording continuing payment:', error);
      setNotification({ message: 'Error recording continuing loan payment.', type: 'error' });
    }
  };

  const handleRemoveDefaulterStatus = async (defaulterId) => {
    try {
      await removeDefaulterStatus(selectedLoan.id, defaulterId);
      setNotification({ message: 'Defaulter status removed successfully!', type: 'success' });
      fetchLoans();
      handleLoanSelect(selectedLoan.id);
    } catch (error) {
      console.error('Error removing defaulter status:', error);
      setNotification({ message: 'Error removing defaulter status.', type: 'error' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} email={email} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Loan Tract</h3>
            
            <div className="mt-8">
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg mr-4 text-lg"
                onClick={() => handleFormToggle('defaulter')}
              >
                Defaulter
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                onClick={() => handleFormToggle('continuing')}
              >
                Continuing
              </button>
            </div>

            <div className="mt-8">
              <label htmlFor="loan-select" className="block text-lg font-medium text-gray-700">
                Select Loan
              </label>
              <select
                id="loan-select"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                onChange={(e) => handleLoanSelect(parseInt(e.target.value))}
                value={selectedLoan ? selectedLoan.id : ''}
              >
                <option value="">Select a loan</option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.name} - {loan.type} - {loan.amount}
                  </option>
                ))}
              </select>
            </div>

            {selectedLoan && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Loan Details
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Loan Type</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedLoan.type}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedLoan.amount}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Amount to Repay</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedLoan.amountToRepay}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedLoan.status}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeForm === 'defaulter' && selectedLoan && (
              <form onSubmit={handleDefaulterSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="defaulter-description" className="block text-lg font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="defaulter-description"
                    id="defaulter-description"
                    rows="4"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-black text-lg py-3 px-4"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Submit Defaulter Information
                </button>
              </form>
            )}

            {activeForm === 'continuing' && selectedLoan && (
              <form onSubmit={handleContinuingSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="continuing-new-payment" className="block text-lg font-medium text-gray-700">
                    New Payment
                  </label>
                  <input
                    type="number"
                    name="continuing-new-payment"
                    id="continuing-new-payment"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-black text-lg py-3 px-4"
                  />
                </div>
                <div>
                  <label htmlFor="continuing-payment-date" className="block text-lg font-medium text-gray-700">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="continuing-payment-date"
                    id="continuing-payment-date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-black text-lg py-3 px-4"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Submit Continuing Loan Payment
                </button>
              </form>
            )}

            {selectedLoan && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-700">Defaulter Information</h4>
                {defaulterInfo.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {defaulterInfo.map((info) => (
                      <li key={info.id} className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">{new Date(info.date).toLocaleString()}</p>
                        <p className="mt-2">{info.description}</p>
                        <button
                          onClick={() => handleRemoveDefaulterStatus(info.id)}
                          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Remove Defaulter Status
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-gray-600">No defaulter information recorded.</p>
                )}
              </div>
            )}

            {selectedLoan && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-700">Continuing Payments</h4>
                {continuingPayments.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {continuingPayments.map((payment) => (
                      <li key={payment.id} className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleString()}</p>
                        <p className="mt-2">Amount: {payment.amount}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-gray-600">No continuing payments recorded.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default TractLoansPage;