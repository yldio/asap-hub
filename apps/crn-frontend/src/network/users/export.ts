import { htmlToCsvText } from '@asap-hub/frontend-utils';
import { UserListItemResponse } from '@asap-hub/model';

export const MAX_ALGOLIA_RESULTS = 1000;

export const userToCSV = (user: UserListItemResponse) => ({
  'First Name': user.firstName,
  'Middle Name': user.middleName || '',
  'Last Name': user.lastName,
  Email: user.email,
  ORCID: user.orcid || '',
  Degree: user.degree || '',
  Country: user.country || '',
  State: user.stateOrProvince || '',
  City: user.city || '',
  'Job Title': user.jobTitle || '',
  Institution: user.institution || '',
  'Correspondence Email': user.contactEmail || '',
  Tags:
    user.tags
      ?.map((tag) => tag.name)
      .sort()
      .join(', ') || '',
  Biography: htmlToCsvText(user.biography),
  'Open Science Member': user.openScienceTeamMember ? 'Yes' : 'No',
  'Alumni Since Date': user.alumniSinceDate || '',
  'Team Name': user.teams.map((t) => t.displayName).join(', '),
  Role: user.teams.map((t) => t.role).join(', '),
});
