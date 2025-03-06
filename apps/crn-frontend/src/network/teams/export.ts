import { PartialManuscriptResponse } from '@asap-hub/model';

export const manuscriptToCSV = (manuscript: PartialManuscriptResponse) => ({
  'Manuscript ID': manuscript.id,
  Title: manuscript.title,
  'Team Name': manuscript.team.displayName,
  'Last Updated': manuscript.lastUpdated,
  Status: manuscript.status,
  'Requested APC Coverage': manuscript.requestingApcCoverage,
  'Assigned Users': manuscript.assignedUsers
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(', '),
  'All Teams': manuscript.teams,
});
