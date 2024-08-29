import { getDB, saveDB } from './localStorageDB'; // Importing the localStorageDB functions

// Push to HQ
export const pushToHQ = async () => {
  const db = await getDB(); // Get the current database from localStorage

  const user = JSON.parse(sessionStorage.getItem('currentUser')); // Retrieve the current user from sessionStorage

  if (!user || (user.email !== 'eddieKangethe07@gmail.com' && user.username !== 'Eddwin')) {
    throw new Error('Unauthorized access');
  }

  const jsonData = JSON.stringify(db);
  const fileName = 'HQ.json';
  const repo = 'WofuoKenya';
  const owner = 'Nevi32';
  const token = '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'; // Your provided token

  const base64Content = btoa(jsonData);

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update HQ.json with the latest data',
        content: base64Content,
        branch: 'main',
      }),
    });

    if (response.ok) {
      // Clear localStorage except for user info
      const userInfo = JSON.parse(localStorage.getItem('WofuoDB')).users.find(
        (u) => u.email === user.email
      );
      localStorage.clear();
      localStorage.setItem('WofuoDB', JSON.stringify({ users: [userInfo] }));

      console.log('Data successfully pushed to HQ and localStorage cleared.');
    } else {
      console.error('Failed to push to HQ:', await response.json());
    }
  } catch (error) {
    console.error('Error pushing to HQ:', error);
  }
};

// Pull from HQ
export const pullFromHQ = async () => {
  const fileName = 'HQ.json';
  const repo = 'WofuoKenya';
  const owner = 'Nevi32';
  const token = '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'; // Your provided token

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const content = atob(data.content); // Decode base64 content
      const db = JSON.parse(content);

      await saveDB(db); // Save the pulled data to localStorage
      console.log('Data pulled from HQ and saved to localStorage.');
    } else {
      console.error('Failed to pull from HQ:', await response.json());
    }
  } catch (error) {
    console.error('Error pulling from HQ:', error);
  }
};

// Implementations for pushToBranch and pullFromBranch can be similar to pushToHQ and pullFromHQ
export const pushToBranch = async () => {
  // Implementation
};

export const pullFromBranch = async () => {
  // Implementation
};
 