import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../lib/firebase-config.mjs';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/Dashboard.css';
import { initDB, getDB } from '../utils/localStorageDB';

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [pushStatus, setPushStatus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await initDB();
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const db = await getDB();
      setLocalData(db);
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getMemberNationalId = async (groupName, memberName) => {
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
    try {
      const collectionRef = collection(db, collectionName);
      let updatedCount = 0;
      let createdCount = 0;
      let deletedCount = 0;

      // Special handling for defaulters
      if (collectionName === 'defaulters') {
        const firestoreDefaulters = await getDocs(collectionRef);
        
        if (data.length === 0) {
          // If there are no defaulters in local storage, delete all defaulters in Firestore
          for (const doc of firestoreDefaulters.docs) {
            await deleteDoc(doc.ref);
            deletedCount++;
          }
          setPushStatus(prev => ({
            ...prev,
            [collectionName]: `Success: Deleted all ${deletedCount} defaulters from Firestore`
          }));
          return; // Exit the function early as we don't need to process anything else
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
          // Document exists, update it
          const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
          await updateDoc(docRef, item);
          updatedCount++;
        } else {
          // Document doesn't exist, create new one
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
    if (!localData) {
      alert('No local data found!');
      return;
    }

    setPushStatus({});

    // Sync members first
    if (localData.members && localData.members.length > 0) {
      await syncCollectionToFirestore('members', localData.members);
    }

    const collections = [
      'users', 'savings', 'totalSavings', 'withdrawals',
      'groupLoans', 'longTermLoans', 'shortTermLoans',
      'continuingPayments', 'defaulters', 'visits'
    ];
    for (const collectionName of collections) {
      // For defaulters, we want to sync even if the local data is empty
      if (collectionName === 'defaulters' || (localData[collectionName] && localData[collectionName].length > 0)) {
        await syncCollectionToFirestore(collectionName, localData[collectionName] || []);
      }
    }

    alert('Sync with Firestore completed. Check the status for each collection.');
  };

  const handlePullFromLocalStorage = async () => {
    try {
      await initDB();
      const db = await getDB();
      setLocalData(db);
      alert('Data pulled from localStorage successfully!');
    } catch (error) {
      console.error('Error pulling data from localStorage:', error);
      alert('Failed to pull data from localStorage.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleSyncWithFirestore}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-300"
              >
                Sync with Firestore
              </button>
              <button
                onClick={handlePullFromLocalStorage}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition duration-300"
              >
                Pull from localStorage
              </button>
            </div>
            {currentUser && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Current User:</h3>
                <p>Email: {currentUser.email}</p>
                <p>Username: {currentUser.username}</p>
              </div>
            )}
            {localData && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Local Data Summary:</h3>
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
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Sync Status:</h3>
                {Object.entries(pushStatus).map(([collection, status]) => (
                  <p key={collection}>{collection}: {status}</p>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;


