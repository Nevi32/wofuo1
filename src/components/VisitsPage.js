import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Search, X, Edit } from 'lucide-react';
import { fetchAllVisits } from '../utils/visitsUtil';

const VisitsPage = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisitInfo, setEditingVisitInfo] = useState(false);

  useEffect(() => {
    const loadVisits = async () => {
      const allVisits = await fetchAllVisits();
      setVisits(allVisits);
    };
    loadVisits();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVisits = visits.filter(visit =>
    visit.visitDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVisitClick = (visit) => {
    setSelectedVisit(visit);
    setEditingVisitInfo(false);
  };

  const handleClosePopup = () => {
    setSelectedVisit(null);
    setEditingVisitInfo(false);
  };

  const handleEditVisitInfo = () => {
    setEditingVisitInfo(true);
  };

  const handleSaveVisitInfo = (updatedVisit) => {
    setVisits(visits.map(visit => 
      visit.visitDate === selectedVisit.visitDate ? updatedVisit : visit
    ));
    setSelectedVisit(updatedVisit);
    setEditingVisitInfo(false);
    // TODO: Implement saving visit data
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath="/visits" />
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedVisit ? 'blur-sm' : ''}`}>
        <Navbar email={email} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Visits</h2>
            <div className="sticky top-0 bg-gray-100 py-4 z-20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search visits..."
                  className="w-full p-2 pl-10 pr-4 border rounded text-black"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredVisits.map(visit => (
                <div key={visit.visitDate} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-black mb-2">{visit.visitDate}</h3>
                  <p className="text-sm text-gray-600 mb-2">Time: {visit.visitTime}</p>
                  <p className="text-sm text-gray-600 mb-2">Next Visit: {visit.nextVisitDate}</p>
                  <button
                    onClick={() => handleVisitClick(visit)}
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

      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              {editingVisitInfo ? (
                <input
                  type="text"
                  value={selectedVisit.visitDate}
                  onChange={(e) => setSelectedVisit({ ...selectedVisit, visitDate: e.target.value })}
                  className="text-lg font-bold text-black border-b-2 border-purple-600 focus:outline-none"
                />
              ) : (
                <h3 className="text-lg font-bold text-black">{selectedVisit.visitDate}</h3>
              )}
              <div className="flex items-center">
                {editingVisitInfo ? (
                  <button
                    onClick={() => handleSaveVisitInfo(selectedVisit)}
                    className="text-purple-600 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={handleEditVisitInfo} className="text-purple-600 mr-2">
                    <Edit size={20} />
                  </button>
                )}
                <button onClick={handleClosePopup} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            {editingVisitInfo ? (
              <div className="space-y-4">
                {/* Add form fields for editing visit information */}
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedVisit.members.map((member, index) => (
                  <li key={index} className="flex flex-col space-y-2">
                    <span className="text-black">Member Name: {member.memberName}</span>
                    <span className="text-gray-600">Total Loan Given: Ksh {member.totalLoanGiven}</span>
                    <span className="text-gray-600">Loan BF: Ksh {member.loanBF}</span>
                    <span className="text-gray-600">Shares BF: Ksh {member.sharesBF}</span>
                    <span className="text-gray-600">Total Repaid: Ksh {member.totalRepaid}</span>
                    <span className="text-gray-600">Principal: Ksh {member.principal}</span>
                    <span className="text-gray-600">Loan Interest: Ksh {member.loanInterest}</span>
                    <span className="text-gray-600">Shares Savings This Month: Ksh {member.sharesSavingsThisMonth}</span>
                    <span className="text-gray-600">INS: Ksh {member.ins}</span>
                    <span className="text-gray-600">Shares Savings CF: Ksh {member.sharesSavingsCF}</span>
                    <span className="text-gray-600">Loan CF: Ksh {member.loanCF}</span>
                    <span className="text-gray-600">Status: {member.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitsPage;





