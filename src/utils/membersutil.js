import { initDB, getDB, saveDB } from './localStorageDB'; // Adjust the import path as necessary

// Fetch all members
export const getMembers = async () => {
  await initDB(); // Ensure the database is initialized
  const db = await getDB(); // Retrieve the database
  return db.members || []; // Return the members array, defaulting to an empty array if not found
};

// Add a new member
export const addMember = async (member) => {
  await initDB(); // Ensure the database is initialized
  const db = await getDB(); // Retrieve the database
  db.members = db.members || []; // Ensure the members array exists
  db.members.push(member); // Add the new member
  await saveDB(db); // Save the updated database
};

// Update an existing member
export const updateMember = async (updatedMember) => {
  await initDB(); // Ensure the database is initialized
  const db = await getDB(); // Retrieve the database
  const members = db.members || []; // Get the members array
  const index = members.findIndex(member => member.nationalId === updatedMember.nationalId);

  if (index !== -1) {
    members[index] = updatedMember; // Update the member
    db.members = members; // Set the updated members array
    await saveDB(db); // Save the updated database
  }
};

// Delete a member
export const deleteMember = async (nationalId) => {
  await initDB(); // Ensure the database is initialized
  const db = await getDB(); // Retrieve the database
  db.members = db.members.filter(member => member.nationalId !== nationalId); // Filter out the member to delete
  await saveDB(db); // Save the updated database
};

// Example function to update a group's name
export const updateGroupName = async (groupId, newName) => {
  await initDB(); // Ensure the database is initialized
  const db = await getDB(); // Retrieve the database
  if (db.groups) {
    db.groups = db.groups.map(group =>
      group.id === groupId ? { ...group, name: newName } : group
    );
    await saveDB(db); // Save the updated database
  }
};

