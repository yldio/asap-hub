import { Router } from 'express';
import { appFactory } from '../../src/app';
import supertest from 'supertest';
import { authHandlerFactory } from '../../src/middleware/auth-handler';
import { auth0UserMock } from '../../src/utils/__mocks__/validate-token';
import { DecodeToken } from '../../src/utils/validate-token';
import { origin } from '../../src/config';

describe('Authentication middleware', () => {
  const mockRoutes = Router();
  mockRoutes.get('/test-route', async (req, res) => {
    return res.json(req.loggedInUser);
  });
  const decodeToken: jest.MockedFunction<DecodeToken> = jest.fn();
  const authHandler = authHandlerFactory(decodeToken);
  const app = appFactory({
    mockRequestHandlers: [mockRoutes],
    authHandler,
  });

  afterEach(() => {
    decodeToken.mockReset();
  });

  test('Should return 401 when Authorization header is not set', async () => {
    const response = await supertest(app).get('/test-route');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when method is not bearer', async () => {
    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Basic token');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when token is invalid', async () => {
    decodeToken.mockRejectedValueOnce(new Error());

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when user from a different origin is returned', async () => {
    decodeToken.mockResolvedValueOnce({
      [`some-other-origin/user`]: {
        id: 'userId',
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
        algoliaApiKey: 'test-api-key',
      },
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
    });

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(401);
  });

  test('Should return 200 when token is valid', async () => {
    decodeToken.mockResolvedValueOnce(auth0UserMock);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(200);
  });

  test('Should attach the logged in user to the req object correctly', async () => {
    decodeToken.mockResolvedValueOnce(auth0UserMock);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.body).toEqual(auth0UserMock[`${origin}/user`]);
  });
});
