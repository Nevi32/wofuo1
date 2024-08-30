import { initDB, getDB, saveDB } from './localStorageDB';

// Function to record a group loan
export const recordGroupLoan = async (groupName, loanAmount, period, companyPayout, interestAmount, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();
  
  // Convert group name to uppercase
  const upperGroupName = groupName.toUpperCase();

  if (!db.groupLoans) {
    db.groupLoans = [];
  }
  
  db.groupLoans.push({
    id: Date.now(),
    type: 'group',
    name: upperGroupName,
    amount: loanAmount,
    term: period,
    interest: interestAmount,
    status: 'Approved',
    companyPayout,
    dateIssued,
    dateToRepay
  });
  
  await saveDB(db);
  return { groupName: upperGroupName, loanAmount, dateIssued };
};

// Function to record a long-term loan
export const recordLongTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();

  // Convert group and member names to uppercase
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  
  if (!db.longTermLoans) {
    db.longTermLoans = [];
  }
  
  db.longTermLoans.push({
    id: Date.now(),
    type: 'long-term',
    name: `${upperGroupName} - ${upperMemberName}`,
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
  return { groupName: upperGroupName, memberName: upperMemberName, loanAmount, dateIssued };
};

// Function to record a short-term loan
export const recordShortTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initDB();
  const db = await getDB();

  // Convert group and member names to uppercase
  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  
  if (!db.shortTermLoans) {
    db.shortTermLoans = [];
  }
  
  db.shortTermLoans.push({
    id: Date.now(),
    type: 'short-term',
    name: `${upperGroupName} - ${upperMemberName}`,
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
  return { groupName: upperGroupName, memberName: upperMemberName, loanAmount, dateIssued };
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
