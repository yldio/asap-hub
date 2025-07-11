import { PartialManuscriptResponse } from '@asap-hub/model';

export const manuscriptToCSV = (manuscript: PartialManuscriptResponse) => ({
  'Manuscript ID': manuscript.manuscriptId,
  Title: manuscript.title,
  'Team Name': manuscript.team.displayName,
  'Last Updated': manuscript.lastUpdated,
  Status: manuscript.status,
  'Requested APC Coverage': manuscript.apcRequested,
  'APC Requested Amount': manuscript.apcAmountRequested,
  'APC Request Status': manuscript.apcCoverageRequestStatus || '',
  'APC Paid Amount': manuscript.apcAmountPaid,
  'APC Declined Reason': manuscript.declinedReason || '',
  'Assigned Users': manuscript.assignedUsers
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(', '),
  'All Teams': manuscript.teams,
});
