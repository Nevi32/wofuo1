const DB_NAME = 'WofuoDB';

// Initialize the database
export const initDB = () => {
  return new Promise((resolve) => {
    if (!localStorage.getItem(DB_NAME)) {
      localStorage.setItem(DB_NAME, JSON.stringify({
        users: [],
        members: [],
        savings: [],
        totalSavings: [],
        withdrawals: [],
        groupLoans: [],
        longTermLoans: [],
        shortTermLoans: [],
        continuingPayments: [],
        defaulters: [],
        visits: []
      }));
    }
    resolve();
  });
};

// Get the database object from localStorage
export const getDB = () => {
  return new Promise((resolve) => {
    const db = JSON.parse(localStorage.getItem(DB_NAME));
    resolve(db);
  });
};

// Save the database object to localStorage
export const saveDB = (db) => {
  return new Promise((resolve) => {
    localStorage.setItem(DB_NAME, JSON.stringify(db));
    resolve();
  });
};

// Merge new data with existing data in the database
export const mergeData = (existingData, newData) => {
  const mergedData = { ...existingData };

  for (const [key, value] of Object.entries(newData)) {
    if (Array.isArray(mergedData[key])) {
      // Merge arrays, avoiding duplicates based on 'id'
      const existingIds = new Set(mergedData[key].map(item => item.id));
      const newItems = value.filter(item => !existingIds.has(item.id));
      mergedData[key] = [...mergedData[key], ...newItems];
    } else {
      mergedData[key] = value;
    }
  }

  return mergedData;
};

// Add a new item to a specific collection
export const addItem = async (collectionName, item) => {
  const db = await getDB();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  db[collectionName].push(item);
  await saveDB(db);
};

// Update an item in a specific collection
export const updateItem = async (collectionName, itemId, updatedItem) => {
  const db = await getDB();
  if (!db[collectionName]) {
    throw new Error(`Collection ${collectionName} does not exist`);
  }
  const index = db[collectionName].findIndex(item => item.id === itemId);
  if (index === -1) {
    throw new Error(`Item with id ${itemId} not found in ${collectionName}`);
  }
  db[collectionName][index] = { ...db[collectionName][index], ...updatedItem };
  await saveDB(db);
};

// Delete an item from a specific collection
export const deleteItem = async (collectionName, itemId) => {
  const db = await getDB();
  if (!db[collectionName]) {
    throw new Error(`Collection ${collectionName} does not exist`);
  }
  db[collectionName] = db[collectionName].filter(item => item.id !== itemId);
  await saveDB(db);
};

// Get all items from a specific collection
export const getCollection = async (collectionName) => {
  const db = await getDB();
  return db[collectionName] || [];
};

// Clear all data from the database
export const clearDB = async () => {
  await saveDB({
    users: [],
    members: [],
    savings: [],
    totalSavings: [],
    withdrawals: [],
    groupLoans: [],
    longTermLoans: [],
    shortTermLoans: [],
    continuingPayments: [],
    defaulters: [],
    visits: []
  });
};

// Get the size of the database in bytes
export const getDBSize = () => {
  const db = localStorage.getItem(DB_NAME);
  return db ? new Blob([db]).size : 0;
};