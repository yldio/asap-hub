import { AuthOptions, WebAuth } from 'auth0-js';
import { mockLocation } from '@asap-hub/dom-test-utils';

import {
  authorizeWithSsoFactory,
  authorizeWithEmailPasswordFactory,
  sendPasswordResetLinkFactory,
} from '../web-auth';

import { WebAuthError } from '../errors';

var mockLogin: jest.MockedFunction<WebAuth['login']>;
var mockSignup: jest.MockedFunction<WebAuth['signup']>;
var mockChangePassword: jest.MockedFunction<WebAuth['changePassword']>;

jest.mock('auth0-js', () => {
  mockLogin = jest.fn();
  mockSignup = jest.fn();
  mockChangePassword = jest.fn();
  const { WebAuth: ActualWebAuth } =
    jest.requireActual<typeof import('auth0-js')>('auth0-js');
  return {
    WebAuth: class MockWebAuth extends ActualWebAuth {
      constructor(options: AuthOptions) {
        super(options);
        this.login = mockLogin;
        this.signup = mockSignup;
        this.changePassword = mockChangePassword;
      }
    },
  };
});

const clientID = 'client-id';
const domain = 'auth.example.com';

const authorizeWithSso = authorizeWithSsoFactory(clientID, domain);
const authorizeWithEmailPassword = authorizeWithEmailPasswordFactory(
  clientID,
  domain,
);
const sendPasswordResetLink = sendPasswordResetLinkFactory(clientID, domain);

afterEach(() => {
  mockLogin.mockReset();
  mockSignup.mockReset();
  mockChangePassword.mockReset();
});

describe('authorizeWithSso', () => {
  const { mockSetLocation } = mockLocation();

  it('redirects, specifying the connection and current query params', async () => {
    authorizeWithSso(
      new URL('/login?response_type=code', globalThis.location.href),
      'google-oauth2',
    );
    expect(mockSetLocation).toHaveBeenCalled();

    const { origin, pathname, searchParams } = new URL(
      mockSetLocation.mock.calls[0][0],
    );
    expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
    expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
    expect(searchParams.get('response_type')).toBe('code');
    expect(searchParams.get('connection')).toBe('google-oauth2');
  });
});

describe('authorizeWithEmailPassword', () => {
  it('logs in with the credentials and current query params', async () => {
    mockLogin.mockImplementation((options, cb) => cb(null, {}));
    await authorizeWithEmailPassword(
      new URL('/login?response_type=code', globalThis.location.href),
      'john.doe@example.com',
      'PW',
      false,
    );
    expect(mockLogin).toHaveBeenCalled();

    const { email, password, realm, responseType } = mockLogin.mock.calls[0][0];
    expect(email).toBe('john.doe@example.com');
    expect(password).toBe('PW');
    expect(responseType).toBe('code');
    expect(realm).toMatchInlineSnapshot(`"Username-Password-Authentication"`);
  });

  describe('in signup mode', () => {
    it('signs up with the credentials and current query params', async () => {
      mockSignup.mockImplementation((options, cb) => cb(null, {}));
      mockLogin.mockImplementation((options, cb) => cb(null, {}));

      await authorizeWithEmailPassword(
        new URL(
          '/login?response_type=code&screen_hint=signup',
          globalThis.location.href,
        ),
        'john.doe@example.com',
        'PW',
        true,
      );

      expect(mockSignup).toHaveBeenCalled();
      const { email, password, connection } = mockSignup.mock.calls[0][0];
      expect(email).toBe('john.doe@example.com');
      expect(password).toBe('PW');
      expect(connection).toMatchInlineSnapshot(
        `"Username-Password-Authentication"`,
      );
    });

    it('logs in with the credentials and current query params after a successful signup', async () => {
      mockSignup.mockImplementation((options, cb) => cb(null, {}));
      mockLogin.mockImplementation((options, cb) => cb(null, {}));

      await authorizeWithEmailPassword(
        new URL(
          '/login?response_type=code&screen_hint=signup',
          globalThis.location.href,
        ),
        'john.doe@example.com',
        'PW',
        true,
      );
      expect(mockLogin).toHaveBeenCalled();

      const { email, password } = mockLogin.mock.calls[0][0];
      expect(email).toBe('john.doe@example.com');
      expect(password).toBe('PW');
    });

    it('rejects with an unsuccessful signup error', async () => {
      mockSignup.mockImplementation((options, cb) =>
        cb(new Error('Signup failed.') as unknown as WebAuthError, null),
      );
      mockLogin.mockImplementation((options, cb) => cb(null, {}));

      await expect(
        authorizeWithEmailPassword(
          new URL(
            '/login?response_type=code&screen_hint=signup',
            globalThis.location.href,
          ),
          'john.doe@example.com',
          'PW',
          true,
        ),
      ).rejects.toThrow('Signup failed.');
    });
  });
});

describe('sendPasswordResetLink', () => {
  it('asks Auth0 to send the password reset link to the email address', async () => {
    mockChangePassword.mockImplementation((options, cb) => cb(null, undefined));
    await sendPasswordResetLink('john.doe@example.com');
    expect(mockChangePassword).toHaveBeenCalled();

    const { email, connection } = mockChangePassword.mock.calls[0][0];
    expect(email).toBe('john.doe@example.com');
    expect(connection).toMatchInlineSnapshot(
      `"Username-Password-Authentication"`,
    );
  });

  it('rejects if the password reset fails', async () => {
    mockChangePassword.mockImplementation((options, cb) =>
      cb(new Error('Password reset failed.') as unknown as WebAuthError, null),
    );
    await expect(sendPasswordResetLink('john.doe@example.com')).rejects.toThrow(
      'Password reset failed.',
    );
  });
});
