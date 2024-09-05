import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from '../lib/firebase-config.mjs';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/Dashboard.css';
import { initDB, getDB, saveDB, mergeData } from '../utils/localStorageDB';

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [pushStatus, setPushStatus] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [pullStatus, setPullStatus] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await initDB();
      const user = auth.currentUser;
      if (user) {
        setCurrentUser({
          email: user.email,
          username: user.displayName || user.email.split('@')[0]
        });
      } else {
        // If no user is authenticated, redirect to login
        navigate('/login');
        return;
      }
      const db = await getDB();
      setLocalData(db);
    };
    fetchData();
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getMemberNationalId = async (groupName, memberName) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    const membersRef = collection(db, 'members');
    const q = query(membersRef, 
      where('groupName', '==', groupName),
      where('fullName', '==', memberName)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().nationalId;
    }
    return null;
  };

  const syncCollectionToFirestore = async (collectionName, data) => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    try {
      const collectionRef = collection(db, collectionName);
      let updatedCount = 0;
      let createdCount = 0;
      let deletedCount = 0;

      // Special handling for defaulters
      if (collectionName === 'defaulters') {
        const firestoreDefaulters = await getDocs(collectionRef);
        
        if (data.length === 0) {
          for (const doc of firestoreDefaulters.docs) {
            await deleteDoc(doc.ref);
            deletedCount++;
          }
          setPushStatus(prev => ({
            ...prev,
            [collectionName]: `Success: Deleted all ${deletedCount} defaulters from Firestore`
          }));
          return;
        }
      }

      for (const item of data) {
        let queryConstraints = [];
        switch(collectionName) {
          case 'members':
            queryConstraints = [
              where('groupName', '==', item.groupName),
              where('fullName', '==', item.fullName),
              where('nationalId', '==', item.nationalId)
            ];
            break;
          case 'users':
            queryConstraints = [where('email', '==', item.email)];
            break;
          case 'groupLoans':
          case 'longTermLoans':
          case 'shortTermLoans':
            queryConstraints = [where('id', '==', item.id)];
            break;
          case 'continuingPayments':
          case 'defaulters':
            queryConstraints = [
              where('id', '==', item.id),
              where('loanId', '==', item.loanId)
            ];
            break;
          case 'visits':
            queryConstraints = [
              where('groupName', '==', item.groupName),
              where('visitDate', '==', item.visitDate)
            ];
            break;
          default:
            const nationalId = await getMemberNationalId(item.groupName, item.memberName);
            if (!nationalId) {
              console.error(`No matching member found for ${item.memberName} in group ${item.groupName}`);
              continue;
            }
            queryConstraints = [
              where('groupName', '==', item.groupName),
              where('memberName', '==', item.memberName),
              where('nationalId', '==', nationalId)
            ];
            if (item.savingDate) queryConstraints.push(where('savingDate', '==', item.savingDate));
            if (item.withdrawDate) queryConstraints.push(where('withdrawDate', '==', item.withdrawDate));
        }

        const q = query(collectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
          await updateDoc(docRef, item);
          updatedCount++;
        } else {
          if (!['members', 'users', 'groupLoans', 'longTermLoans', 'shortTermLoans', 'continuingPayments', 'defaulters', 'visits'].includes(collectionName)) {
            const nationalId = await getMemberNationalId(item.groupName, item.memberName);
            item.nationalId = nationalId;
          }
          await addDoc(collectionRef, item);
          createdCount++;
        }
      }

      setPushStatus(prev => ({
        ...prev,
        [collectionName]: `Success: Updated ${updatedCount}, Created ${createdCount}, Deleted ${deletedCount}`
      }));
    } catch (error) {
      console.error(`Error syncing ${collectionName} with Firestore:`, error);
      setPushStatus(prev => ({ ...prev, [collectionName]: 'Failed' }));
    }
  };

  const handleSyncWithFirestore = async () => {
    if (!auth.currentUser) {
      alert('You must be logged in to sync data.');
      return;
    }
    if (!localData) {
      alert('No local data found!');
      return;
    }

    setPushStatus({});

    if (localData.members && localData.members.length > 0) {
      await syncCollectionToFirestore('members', localData.members);
    }

    const collections = [
      'users', 'savings', 'totalSavings', 'withdrawals',
      'groupLoans', 'longTermLoans', 'shortTermLoans',
      'continuingPayments', 'defaulters', 'visits'
    ];
    for (const collectionName of collections) {
      if (collectionName === 'defaulters' || (localData[collectionName] && localData[collectionName].length > 0)) {
        await syncCollectionToFirestore(collectionName, localData[collectionName] || []);
      }
    }

    alert('Sync with Firestore completed. Check the status for each collection.');
  };

  const handlePullFromFirestore = () => {
    if (!auth.currentUser) {
      alert('You must be logged in to pull data.');
      return;
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setGroupName('');
    setPullStatus('');
  };

  const handlePullData = async () => {
    if (!auth.currentUser) {
      alert('You must be logged in to pull data.');
      return;
    }
    if (!groupName) {
      alert('Please enter a group name');
      return;
    }

    try {
      setPullStatus('Pulling data...');
      const collections = [
        'members', 'savings', 'totalSavings', 'withdrawals',
        'groupLoans', 'longTermLoans', 'shortTermLoans',
        'continuingPayments', 'defaulters', 'visits'
      ];

      let allData = {};

      for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where('groupName', '==', groupName));
        const querySnapshot = await getDocs(q);
        
        allData[collectionName] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      const existingData = await getDB();
      const mergedData = mergeData(existingData, allData);

      await saveDB(mergedData);
      setLocalData(mergedData);
      setPullStatus('Data pulled successfully!');
    } catch (error) {
      console.error('Error pulling data from Firestore:', error);
      setPullStatus('Failed to pull data from Firestore.');
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={handleSyncWithFirestore}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-300"
              >
                Sync with Firestore
              </button>
              <button
                onClick={handlePullFromFirestore}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-300"
              >
                Pull from Firestore
              </button>
            </div>
            {currentUser && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Current User:</h3>
                <p>Email: {currentUser.email}</p>
                <p>Username: {currentUser.username}</p>
              </div>
            )}
            {localData && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Local Data Summary:</h3>
                <p>Users: {localData.users?.length || 0}</p>
                <p>Members: {localData.members?.length || 0}</p>
                <p>Savings Entries: {localData.savings?.length || 0}</p>
                <p>Total Savings Entries: {localData.totalSavings?.length || 0}</p>
                <p>Withdrawals: {localData.withdrawals?.length || 0}</p>
                <p>Group Loans: {localData.groupLoans?.length || 0}</p>
                <p>Long-term Loans: {localData.longTermLoans?.length || 0}</p>
                <p>Short-term Loans: {localData.shortTermLoans?.length || 0}</p>
                <p>Continuing Payments: {localData.continuingPayments?.length || 0}</p>
                <p>Defaulters: {localData.defaulters?.length || 0}</p>
                <p>Visits: {localData.visits?.length || 0}</p>
              </div>
            )}
            {Object.keys(pushStatus).length > 0 && (
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Sync Status:</h3>
                {Object.entries(pushStatus).map(([collection, status]) => (
                  <p key={collection}>{collection}: {status}</p>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {showDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pull Data from Firestore</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Enter the group name to pull data from Firestore:
                </p>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="Group Name"
                />
                {pullStatus && (
                  <p className="mt-2 text-sm text-gray-500">
                    Status: {pullStatus}
                  </p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-purple-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  onClick={handlePullData}
                >
                  Pull
                </button>
                <button
                  id="cancel-btn"
                  className="mt-3 px-4 py-2 bg-white text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
