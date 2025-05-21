import { PartialManuscriptResponse } from '@asap-hub/model';

export const manuscriptToCSV = (manuscript: PartialManuscriptResponse) => ({
  'Manuscript ID': manuscript.manuscriptId,
  Title: manuscript.title,
  'Team Name': manuscript.team.displayName,
  'Last Updated': manuscript.lastUpdated,
  Status: manuscript.status,
  // TODO: fix this once the apcCoverageRequestStatus is properly implemented
  'Requested APC Coverage': '',
  'Assigned Users': manuscript.assignedUsers
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(', '),
  'All Teams': manuscript.teams,
});
