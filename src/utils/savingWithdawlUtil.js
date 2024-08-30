import { initDB, getDB, saveDB } from './localStorageDB';

// Function to record a withdrawal and update total savings
export const recordWithdrawal = async (groupName, memberName, withdrawAmount, companyPayout, amountGiven, withdrawDate) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Convert group and member names to uppercase
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();

  // Ensure the withdrawals array exists
  if (!db.withdrawals) {
    db.withdrawals = [];
  }

  // Record the withdrawal
  db.withdrawals.push({
    groupName: upperGroupName,
    memberName: upperMemberName,
    withdrawAmount,
    companyPayout,
    amountGiven,
    withdrawDate
  });

  // Update total savings
  if (!db.totalSavings) {
    db.totalSavings = [];
  }

  const memberTotal = db.totalSavings.find(
    (entry) => entry.groupName === upperGroupName && entry.memberName === upperMemberName
  );

  if (memberTotal) {
    memberTotal.totalAmount -= parseFloat(withdrawAmount);
  }

  await saveDB(db);
  return { groupName: upperGroupName, memberName: upperMemberName, withdrawAmount };
};

// Function to record a saving and update total savings
export const recordSaving = async (groupName, memberName, savingAmount, savingDate) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Convert group and member names to uppercase
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();

  // Ensure the savings array exists
  if (!db.savings) {
    db.savings = [];
  }

  // Record the saving
  db.savings.push({
    groupName: upperGroupName,
    memberName: upperMemberName,
    savingAmount,
    savingDate
  });

  // Update total savings
  if (!db.totalSavings) {
    db.totalSavings = [];
  }

  const memberTotal = db.totalSavings.find(
    (entry) => entry.groupName === upperGroupName && entry.memberName === upperMemberName
  );

  if (memberTotal) {
    memberTotal.totalAmount += parseFloat(savingAmount);
  } else {
    db.totalSavings.push({
      groupName: upperGroupName,
      memberName: upperMemberName,
      totalAmount: parseFloat(savingAmount)
    });
  }

  await saveDB(db);
  return { groupName: upperGroupName, memberName: upperMemberName, savingAmount };
};

// Function to get total savings
export const getTotalSavings = async () => {
  await initDB();
  const db = await getDB();
  return db.totalSavings || [];
};

// Function to get withdrawals
export const getWithdrawals = async () => {
  await initDB();
  const db = await getDB();
  return db.withdrawals || [];
};

// New function to get savings history for a specific member
export const getMemberSavings = async (groupName, memberName) => {
  await initDB();
  const db = await getDB();
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  return (db.savings || []).filter(saving => 
    saving.groupName === upperGroupName && saving.memberName === upperMemberName
  );
};

// New function to get withdrawal history for a specific member
export const getMemberWithdrawals = async (groupName, memberName) => {
  await initDB();
  const db = await getDB();
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  return (db.withdrawals || []).filter(withdrawal => 
    withdrawal.groupName === upperGroupName && withdrawal.memberName === upperMemberName
  );
};
