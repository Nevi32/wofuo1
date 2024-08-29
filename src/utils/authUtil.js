import { initDB, getDB, saveDB } from './localStorageDB';

export const signUp = async (email, username, password) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Check if the user already exists
  const existingUser = db.users.find(user => user.email === email || user.username === username);

  if (existingUser) {
    throw new Error('Email or username already in use.');
  }

  // Add the new user to the database
  db.users.push({ email, username, password });
  await saveDB(db);

  return { email, username };
};

export const login = async (email, password) => {
  await initDB(); // Ensure the database is initialized

  const db = await getDB();

  // Check if the user exists and the password matches
  const user = db.users.find(user => user.email === email && user.password === password);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Store user info in session storage
  sessionStorage.setItem('currentUser', JSON.stringify(user));

  return { user };
};

