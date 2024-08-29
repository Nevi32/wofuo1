import React, { useState, useEffect } from 'react';
import { pushToHQ } from '../utils/syncFunctions'; // import the functions you need

const SettingsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    setUser(currentUser);
  }, []);

  const handlePushToHQ = async () => {
    try {
      await pushToHQ();
      alert('Pushed to HQ successfully!');
    } catch (error) {
      console.error('Failed to push to HQ:', error);
    }
  };

  return (
    <div className="settings-page">
      <nav className="navbar"> {/* Add your navbar component here */}</nav>
      <aside className="sidebar"> {/* Add your sidebar component here */}</aside>
      <div className="content">
        {user && user.email === 'eddieKangethe07@gmail.com' && (
          <>
            <button
              onClick={handlePushToHQ}
              className="bg-red-500 text-white py-2 px-4 rounded mb-4"
            >
              Push to HQ
            </button>
            <button
              onClick={() => console.log('Pull from Branch')}
              className="bg-red-500 text-white py-2 px-4 rounded mb-4"
            >
              Pull from Branch
            </button>
          </>
        )}
        <button
          onClick={() => console.log('Pull from HQ')}
          className="bg-red-500 text-white py-2 px-4 rounded mb-4"
        >
          Pull from HQ
        </button>
        <button
          onClick={() => console.log('Push to Branch')}
          className="bg-red-500 text-white py-2 px-4 rounded mb-4"
        >
          Push to Branch
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

