import { Auth0User, User } from '@asap-hub/auth';
import { origin } from '../../src/config';

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

const user: Auth0User = {
  [`${origin}/user`]: userMock,
  given_name: 'Joao',
  family_name: 'Tiago',
  nickname: 'joao.tiago',
  name: 'Joao Tiago',
  picture: 'https://lh3.googleusercontent.com/awesomePic',
  locale: 'en',
  updated_at: '2020-10-27T17:55:23.418Z',
  email: 'joao.tiago@asap.science',
  iss: 'https://asap-hub.us.auth0.com/',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: 'audience',
  nonce: 'onlyOnce',
};

export const auth0UserMock = user;

const decodeToken = jest.fn().mockResolvedValue(user);
export default decodeToken;
