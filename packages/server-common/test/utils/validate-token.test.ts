import jwt from 'jsonwebtoken';
import { auth0PubKeys } from '@asap-hub/auth';
import { idToken, getToken } from './validate-token.fixtures';
import { decodeTokenFactory } from '../../src';

jest.mock('@asap-hub/auth');
const authMock = jest.requireMock('@asap-hub/auth');
const originalAuth0PubKeys = auth0PubKeys;
const mockAuthAudience = 'mock-auth0-audience';
const decodeToken = decodeTokenFactory(mockAuthAudience);

describe('Validate token', () => {
  const token = getToken();

  afterEach(() => {
    authMock.auth0PubKeys = originalAuth0PubKeys;
  });

  test('Should throw when cant find KeyId', async () => {
    const token = getToken(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZoR0E4OHUxTmpD1El1N24z4333QyJ9',
    );
    await expect(decodeToken(token)).rejects.toThrow(
      'error in secret or public key callback: Unable to find Public Key with kid=',
    );
  });

  test('Should throw when key is empty', async () => {
    authMock.auth0PubKeys = [
      {
        kid: 'VhGA88u1NjCtIh4CsMW7C',
        x5c: [''],
      },
    ];
    await expect(decodeToken(token)).rejects.toThrow('Received an invalid key');

    authMock.auth0PubKeys = [
      {
        kid: 'VhGA88u1NjCtIh4CsMW7C',
        x5c: [],
      },
    ];
    await expect(decodeToken(token)).rejects.toThrow('Received an invalid key');
  });

  test('Should throw when signature is invalid', async () => {
    const token = getToken(
      undefined,
      'eyJodHRwczovLzQwNy5odWIuYXNhcC5zY2llbmNlL3VzZXIiOnsiaWQiOiJjZjNhZmNlZS05MzdkLTRkYmQtODFkNy0xZGVkNzNjZmExOTYiLCJkaXNwbGF5TmFtZSI6Ikpvw6NvIFRpYWdvIiwiZW1haWwiOiJqb2FvLnRpYWdvQHlsZC5pbyIsImZpcnN0TmFtZSI6Ikpvw6NvIiwibGFzdE5hbWUiOiJUaWFnbyIsInRlYW1zIjpbXX0sImdpdmVuX25hbWUiOiJKb2FvIiwiZmFtaWx5X25hbWUiOiJUaWFnbyIsIm5pY2tuYW1lIjoiam9hby50aWFnbyIsIm5hbWUiOiJKb2FvIFRpYWdvIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoY1V5bUFZQURUT0ZUdFM3ekhkc1diZmkyQWJDSWJwQnR4QWROV3VnPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMC0yOVQxMToyNDoxNi4yMjlsZC5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi1hc2FwLWh1Yi51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk4NDA0MTMxNzUyODY0MDg1OTIiLCJhdWQiOiJ4UkR2Z1plM1FsM0xTWkRzMmRXUVl6Y29oRm5MeWVMMiIsImlhdCI6MTYwMzk3MDY2MCwiZXhwIjoxNjA0MDA2NjYwLCJhdXRoX3RpbWUiOjE2MDM5NzA2NTYsIm5vbmNlIjoiYkc5RlpIaDBkVkZKZEZSc1oxaHZlVmRSVTJ0dkxXTXRVemh6Y0VsbloyczBWazFrYmxsc2RGRm5RZz09In0',
    );
    await expect(decodeToken(token)).rejects.toThrow('invalid signature');
  });

  test('Should throw when token is expired', async () => {
    await expect(decodeToken(token)).rejects.toThrow('jwt expired');
  });

  test('Should throw when audience is missing', async () => {
    const idTokenMissingAudience = {
      ...idToken,
      aud: undefined,
    };

    jest
      .spyOn(jwt, 'verify')
      .mockImplementation(
        (t, f, o, cb) => cb && cb(null, idTokenMissingAudience),
      );

    await expect(decodeToken(token)).rejects.toThrow('Invalid JWT token');
  });

  test('Should throw when audience does not match', async () => {
    const idTokenInvalidAudience = {
      ...idToken,
      aud: ['some-other-audience'],
    };

    jest
      .spyOn(jwt, 'verify')
      .mockImplementation(
        (t, f, o, cb) => cb && cb(null, idTokenInvalidAudience),
      );

    await expect(decodeToken(token)).rejects.toThrow(
      'Token verification: aud field doesnt contain the API Audience',
    );
  });

  test('Should return when id_token is valid', async () => {
    const idTokenValidAudience = {
      ...idToken,
      aud: [mockAuthAudience],
    };

    jest
      .spyOn(jwt, 'verify')
      .mockImplementation(
        (t, f, o, cb) => cb && cb(null, idTokenValidAudience),
      );

    expect(await decodeToken(token)).toBe(idTokenValidAudience);
  });
});
