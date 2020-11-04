import { origin } from '../../config';

/* eslint-disable @typescript-eslint/camelcase */
const decodeToken = jest.fn().mockResolvedValue({
  [origin + '/user']: {
    id: 'userId',
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
    ],
  },
  given_name: 'Joao',
  family_name: 'Tiago',
  nickname: 'joao.tiago',
  name: 'Joao Tiago',
  picture: 'https://lh3.googleusercontent.com/awesomePic',
  locale: 'en',
  updated_at: '2020-10-27T17:55:23.418Z',
  email: 'joao.tiago@asap.science',
  email_verified: true,
  iss: 'https://asap-hub.us.auth0.com/',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: 'audience',
  iat: 1603821328,
  exp: 1603857328,
  auth_time: 1603821323,
  nonce: 'onlyOnce',
});
export default decodeToken;
