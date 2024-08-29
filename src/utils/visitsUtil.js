import { initDB, getDB, saveDB } from './localStorageDB';

// Function to fetch group names and their corresponding members
export const getGroupsAndMembers = async () => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Ensure the members array exists
  if (!db.members) {
    return []; // Return an empty array if there are no members
  }

  // Create a map to group members by their groupName
  const groupsMap = db.members.reduce((acc, member) => {
    const { groupName, fullName } = member;

    if (!acc[groupName]) {
      acc[groupName] = [];
    }

    acc[groupName].push(fullName);
    return acc;
  }, {});

  // Convert the map to an array of objects with groupName and members
  const groups = Object.keys(groupsMap).map(groupName => ({
    groupName,
    members: groupsMap[groupName]
  }));

  return groups;
};

// Function to record visit details and member-specific information
export const recordVisit = async (visitData, tableData) => {
  await initDB(); // Initialize the database if it doesn't exist

  const db = await getDB();

  // Ensure the visits array exists
  if (!db.visits) {
    db.visits = [];
  }

  // Record the visit details
  db.visits.push({
    visitDate: visitData.date,
    visitTime: visitData.time,
    nextVisitDate: visitData.nextVisitDate,
    members: tableData.map(memberData => ({
      memberName: memberData.memberName,
      totalLoanGiven: memberData.totalLoanGiven,
      loanBF: memberData.loanBF,
      sharesBF: memberData.sharesBF,
      totalRepaid: memberData.totalRepaid,
      principal: memberData.principal,
      loanInterest: memberData.loanInterest,
      sharesSavingsThisMonth: memberData.sharesSavingsThisMonth,
      ins: memberData.ins,
      sharesSavingsCF: memberData.sharesSavingsCF,
      loanCF: memberData.loanCF,
      status: memberData.status
    }))
  });

  await saveDB(db);
};
