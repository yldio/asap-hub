import { User } from '@asap-hub/auth';
import { JwtPayload } from 'jsonwebtoken';

export const userMock: User = {
  id: 'userMockId',
  onboarded: true,
  displayName: 'JT',
  email: 'joao.tiago@asap.science',
  firstName: 'Joao',
  lastName: 'Tiago',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Awesome Team',
      role: 'Project Manager',
    },
    {
      id: 'team-id-3',
      displayName: 'Zac Torres',
      role: 'Collaborating PI',
    },
  ],
  algoliaApiKey: 'test-mock-key',
};

export const getJwtPayload = (): JwtPayload => ({
  given_name: 'Joao',
  family_name: 'Tiago',
  name: 'Joao Tiago',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: ['audience'],
});
