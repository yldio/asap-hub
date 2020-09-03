import type { WebAuth, AuthOptions, Auth0Error } from 'auth0-js';

import { authorizeWithSso, authorizeWithEmailPassword } from '../web-auth';

var mockLogin: jest.MockedFunction<WebAuth['login']>;
var mockSignup: jest.MockedFunction<WebAuth['signup']>;

jest.mock('@asap-hub/auth');

jest.mock('auth0-js', () => {
  mockLogin = jest.fn();
  mockSignup = jest.fn();
  const { WebAuth: ActualWebAuth } = jest.requireActual<
    typeof import('auth0-js')
  >('auth0-js');
  return {
    WebAuth: class MockWebAuth extends ActualWebAuth {
      constructor(options: AuthOptions) {
        super(options);
        this.login = mockLogin;
        this.signup = mockSignup;
      }
    },
  };
});
afterEach(() => {
  mockLogin.mockReset();
  mockSignup.mockReset();
});

describe('authorizeWithSso', () => {
  const originalLocation = globalThis.location;
  let setLocation: jest.MockedFunction<typeof globalThis.location.assign>;
  beforeEach(() => {
    setLocation = jest.fn();
    delete globalThis.location;
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      enumerable: true,
      get: () => originalLocation,
      set: setLocation,
    });
  });
  afterEach(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      enumerable: true,
      value: originalLocation,
    });
  });

  it('redirects, specifying the connection and current query params', async () => {
    authorizeWithSso(
      new URL('/login?response_type=code', globalThis.location.href),
      'google-oauth2',
    );
    expect(setLocation).toHaveBeenCalled();

    const { origin, pathname, searchParams } = new URL(
      setLocation.mock.calls[0][0],
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
        cb((new Error('Signup failed.') as unknown) as Auth0Error, null),
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
