const DB_NAME = 'WofuoDB';

// Initialize the database (this function is just a placeholder for consistency)
export const initDB = () => {
  return new Promise((resolve) => {
    if (!localStorage.getItem(DB_NAME)) {
      localStorage.setItem(DB_NAME, JSON.stringify({ users: [] }));
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
