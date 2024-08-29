import { initDB, getDB, saveDB } from './localStorageDB';

// Function to record a group loan
export const recordGroupLoan = async (groupName, loanAmount, period, companyPayout, interestAmount, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();
  
  if (!db.groupLoans) {
    db.groupLoans = [];
  }
  
  db.groupLoans.push({
    id: Date.now(),
    type: 'group',
    name: groupName,
    amount: loanAmount,
    term: period,
    interest: interestAmount,
    status: 'Approved',
    companyPayout,
    dateIssued,
    dateToRepay
  });
  
  await saveDB(db);
  return { groupName, loanAmount, dateIssued };
};

// Function to record a long-term loan
export const recordLongTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();
  
  if (!db.longTermLoans) {
    db.longTermLoans = [];
  }
  
  db.longTermLoans.push({
    id: Date.now(),
    type: 'long-term',
    name: `${groupName} - ${memberName}`,
    amount: loanAmount,
    term: period,
    interest: interestAmount,
    status: 'Approved',
    guarantors,
    loanFormFee,
    dateIssued,
    dateToRepay
  });
  
  await saveDB(db);
  return { groupName, memberName, loanAmount, dateIssued };
};

// Function to record a short-term loan
export const recordShortTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();
  
  if (!db.shortTermLoans) {
    db.shortTermLoans = [];
  }
  
  db.shortTermLoans.push({
    id: Date.now(),
    type: 'short-term',
    name: `${groupName} - ${memberName}`,
    amount: loanAmount,
    term: period,
    interest: interestAmount,
    status: 'Approved',
    guarantors,
    loanFormFee,
    dateIssued,
    dateToRepay
  });
  
  await saveDB(db);
  return { groupName, memberName, loanAmount, dateIssued };
};

// Function to fetch all loans
export const fetchAllLoans = async () => {
  await initDB();
  const db = await getDB();
  
  const groupLoans = db.groupLoans || [];
  const longTermLoans = db.longTermLoans || [];
  const shortTermLoans = db.shortTermLoans || [];
  
  return [...groupLoans, ...longTermLoans, ...shortTermLoans];
};