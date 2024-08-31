import { initDB, getDB, saveDB } from './localStorageDB';

// Initialize the database
const initializeDB = async () => {
  await initDB();
  const db = await getDB();
  if (!db.groupLoans) db.groupLoans = [];
  if (!db.longTermLoans) db.longTermLoans = [];
  if (!db.shortTermLoans) db.shortTermLoans = [];
  if (!db.defaulters) db.defaulters = [];
  if (!db.continuingPayments) db.continuingPayments = [];
  await saveDB(db);
};

// Helper function to find and update a loan in a specific array
const updateLoanInArray = (loanArray, updatedLoan) => {
  return loanArray.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan);
};

// Helper function to calculate amount to repay
const calculateAmountToRepay = (loanAmount, interestAmount) => {
  return parseFloat(loanAmount) + parseFloat(interestAmount);
};

// Function to find a loan by ID
const findLoanById = async (loanId) => {
  await initializeDB();
  const db = await getDB();
  
  const allLoans = [...db.groupLoans, ...db.longTermLoans, ...db.shortTermLoans];
  return allLoans.find(loan => loan.id === parseInt(loanId));
};

// Function to record a group loan
export const recordGroupLoan = async (groupName, loanAmount, period, companyPayout, interestAmount, dateIssued, dateToRepay) => {
  await initializeDB();
  const db = await getDB();
  
  const upperGroupName = groupName.toUpperCase();

  const newLoan = {
    id: Date.now(),
    type: 'group',
    name: upperGroupName,
    amount: parseFloat(loanAmount),
    term: period,
    interest: parseFloat(interestAmount),
    amountToRepay: calculateAmountToRepay(loanAmount, interestAmount),
    status: 'Approved',
    companyPayout,
    dateIssued,
    dateToRepay
  };
  
  db.groupLoans.push(newLoan);
  
  await saveDB(db);
  return newLoan;
};

// Function to record a long-term loan
export const recordLongTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initializeDB();
  const db = await getDB();

  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  
  const newLoan = {
    id: Date.now(),
    type: 'long-term',
    name: `${upperGroupName} - ${upperMemberName}`,
    amount: parseFloat(loanAmount),
    term: period,
    interest: parseFloat(interestAmount),
    amountToRepay: calculateAmountToRepay(loanAmount, interestAmount),
    status: 'Approved',
    guarantors,
    loanFormFee,
    dateIssued,
    dateToRepay
  };
  
  db.longTermLoans.push(newLoan);
  
  await saveDB(db);
  return newLoan;
};

// Function to record a short-term loan
export const recordShortTermLoan = async (groupName, memberName, guarantors, loanAmount, period, interestAmount, loanFormFee, dateIssued, dateToRepay) => {
  await initializeDB();
  const db = await getDB();

  const upperGroupName = groupName.toUpperCase();
  const upperMemberName = memberName.toUpperCase();
  
  const newLoan = {
    id: Date.now(),
    type: 'short-term',
    name: `${upperGroupName} - ${upperMemberName}`,
    amount: parseFloat(loanAmount),
    term: period,
    interest: parseFloat(interestAmount),
    amountToRepay: calculateAmountToRepay(loanAmount, interestAmount),
    status: 'Approved',
    guarantors,
    loanFormFee,
    dateIssued,
    dateToRepay
  };
  
  db.shortTermLoans.push(newLoan);
  
  await saveDB(db);
  return newLoan;
};

// Function to fetch all loans
export const fetchAllLoans = async () => {
  await initializeDB();
  const db = await getDB();
  
  return [...db.groupLoans, ...db.longTermLoans, ...db.shortTermLoans];
};

// Function to update a loan
export const updateLoan = async (updatedLoan) => {
  await initializeDB();
  const db = await getDB();

  // Recalculate amountToRepay if amount or interest has changed
  if (updatedLoan.amount !== undefined || updatedLoan.interest !== undefined) {
    updatedLoan.amountToRepay = calculateAmountToRepay(
      updatedLoan.amount !== undefined ? updatedLoan.amount : updatedLoan.amount,
      updatedLoan.interest !== undefined ? updatedLoan.interest : updatedLoan.interest
    );
  }

  switch (updatedLoan.type) {
    case 'group':
      db.groupLoans = updateLoanInArray(db.groupLoans, updatedLoan);
      break;
    case 'long-term':
      db.longTermLoans = updateLoanInArray(db.longTermLoans, updatedLoan);
      break;
    case 'short-term':
      db.shortTermLoans = updateLoanInArray(db.shortTermLoans, updatedLoan);
      break;
    default:
      throw new Error('Invalid loan type');
  }

  await saveDB(db);
  return updatedLoan;
};

// Function to record defaulter information
export const recordDefaulter = async (loanId, description) => {
  await initializeDB();
  const db = await getDB();
  
  const loan = await findLoanById(loanId);
  if (!loan) {
    throw new Error('Loan not found');
  }
  
  const defaulterInfo = {
    id: Date.now(),
    loanId: parseInt(loanId),
    description,
    date: new Date().toISOString()
  };
  
  db.defaulters.push(defaulterInfo);
  
  // Update loan status
  loan.status = 'Defaulted';
  await updateLoan(loan);
  
  await saveDB(db);
  return defaulterInfo;
};

// Function to remove defaulter status
export const removeDefaulterStatus = async (loanId, defaulterId) => {
  await initializeDB();
  const db = await getDB();
  
  const loan = await findLoanById(loanId);
  if (!loan) {
    throw new Error('Loan not found');
  }
  
  // Remove the defaulter record
  db.defaulters = db.defaulters.filter(defaulter => defaulter.id !== defaulterId);
  
  // Update loan status back to 'Approved'
  loan.status = 'Approved';
  await updateLoan(loan);
  
  await saveDB(db);
  return { message: 'Defaulter status removed successfully' };
};

// Function to record continuing payment
export const recordContinuingPayment = async (loanId, newPayment, paymentDate) => {
  await initializeDB();
  const db = await getDB();
  
  const loan = await findLoanById(loanId);
  if (!loan) {
    throw new Error('Loan not found');
  }
  
  const paymentInfo = {
    id: Date.now(),
    loanId: parseInt(loanId),
    amount: parseFloat(newPayment),
    date: paymentDate
  };
  
  db.continuingPayments.push(paymentInfo);
  
  // Update loan's amount to repay
  loan.amountToRepay = Math.max(0, loan.amountToRepay - parseFloat(newPayment));
  await updateLoan(loan);
  
  await saveDB(db);
  return paymentInfo;
};

// Function to fetch defaulter information for a loan
export const fetchDefaulterInfo = async (loanId) => {
  await initializeDB();
  const db = await getDB();
  
  return db.defaulters.filter(defaulter => defaulter.loanId === parseInt(loanId));
};

// Function to fetch continuing payments for a loan
export const fetchContinuingPayments = async (loanId) => {
  await initializeDB();
  const db = await getDB();
  
  return db.continuingPayments.filter(payment => payment.loanId === parseInt(loanId));
};

// Function to calculate total amount repaid for a loan
export const calculateTotalRepaid = async (loanId) => {
  const payments = await fetchContinuingPayments(loanId);
  return payments.reduce((total, payment) => total + payment.amount, 0);
};

// Function to get loan summary
export const getLoanSummary = async (loanId) => {
  const loan = await findLoanById(loanId);
  if (!loan) {
    throw new Error('Loan not found');
  }

  const totalRepaid = await calculateTotalRepaid(loanId);
  const remainingBalance = Math.max(0, loan.amountToRepay - totalRepaid);

  return {
    ...loan,
    totalRepaid,
    remainingBalance
  };
};

// Function to get all defaulted loans
export const getDefaultedLoans = async () => {
  const allLoans = await fetchAllLoans();
  return allLoans.filter(loan => loan.status === 'Defaulted');
};

// Function to get all active loans
export const getActiveLoans = async () => {
  const allLoans = await fetchAllLoans();
  return allLoans.filter(loan => loan.status !== 'Defaulted' && loan.amountToRepay > 0);
};

// Function to get all fully repaid loans
export const getFullyRepaidLoans = async () => {
  const allLoans = await fetchAllLoans();
  return allLoans.filter(loan => loan.amountToRepay <= 0);
};