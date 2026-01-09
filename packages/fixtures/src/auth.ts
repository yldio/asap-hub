import { User } from '@asap-hub/auth';
import { JwtPayload } from 'jsonwebtoken';

export const createAuthUser = (): User => ({
  id: 'test-id-11',
  onboarded: true,
  displayName: 'Tony Stark',
  email: 'tony.stark@asap.science',
  firstName: 'Tony',
  lastName: 'Stark',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Awesome Team',
      role: 'Project Manager',
    },
  ],
  algoliaApiKey: 'test-mock-key',
  workingGroups: [
    {
      id: 'wg-id-1',
      name: 'Working Group',
      role: 'Project Manager',
      active: true,
    },
  ],
  interestGroups: [
    {
      id: 'ig-id-1',
      name: 'Interest Group',
      active: true,
    },
  ],
  projects: [
    {
      id: 'project-id-1',
      title: 'Discovery Project Alpha',
      projectType: 'Discovery Project',
    },
    {
      id: 'project-id-2',
      title: 'Trainee Project Beta',
      projectType: 'Trainee Project',
    },
  ],
  role: 'Grantee',
  openScienceTeamMember: false,
});

export const getJwtPayload = (): JwtPayload => ({
  given_name: 'Tony',
  family_name: 'Stark',
  name: 'Tony Stark',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: ['audience'],
});
