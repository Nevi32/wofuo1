import { initDB, getDB, saveDB } from './localStorageDB';

// Function to record a withdrawal
export const recordWithdrawal = async (groupName, memberName, withdrawAmount, companyPayout, amountGiven, withdrawDate) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Ensure the withdrawals array exists
  if (!db.withdrawals) {
    db.withdrawals = [];
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

  // Ensure the savings array exists
  if (!db.savings) {
    db.savings = [];
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