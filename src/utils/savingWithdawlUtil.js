import { initDB, getDB, saveDB } from './localStorageDB';

// Function to record a withdrawal
export const recordWithdrawal = async (groupName, memberName, withdrawAmount, companyPayout, amountGiven, withdrawDate) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Find the group and member to validate (this example assumes groups and members are tracked separately)
  const group = db.groups.find(g => g.name === groupName);
  const member = group ? group.members.find(m => m.name === memberName) : null;

  if (!group || !member) {
    throw new Error('Group or member not found.');
  }

  // Record the withdrawal
  db.withdrawals.push({
    groupName,
    memberName,
    withdrawAmount,
    companyPayout,
    amountGiven,
    withdrawDate
  });

  await saveDB(db);
  return { groupName, memberName, withdrawAmount };
};

// Function to record a saving
export const recordSaving = async (groupName, memberName, savingAmount, savingDate) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Find the group and member to validate (this example assumes groups and members are tracked separately)
  const group = db.groups.find(g => g.name === groupName);
  const member = group ? group.members.find(m => m.name === memberName) : null;

  if (!group || !member) {
    throw new Error('Group or member not found.');
  }

  // Record the saving
  db.savings.push({
    groupName,
    memberName,
    savingAmount,
    savingDate
  });

  await saveDB(db);
  return { groupName, memberName, savingAmount };
};
