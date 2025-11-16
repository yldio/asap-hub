import { render, RenderResult, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateKeyPairSync } from 'crypto';
import { createMemoryHistory, History } from 'history';
import { sign } from 'jsonwebtoken';
import { useEffect } from 'react';
import { Router, StaticRouter } from 'react-router-dom';

import nock from 'nock';

import { Auth0 } from '@asap-hub/auth';
import { mockLocation } from '@asap-hub/dom-test-utils';
import { authTestUtils } from '@asap-hub/gp2-components';
import { WelcomePage } from '@asap-hub/react-components';
import { useAuth0GP2 } from '@asap-hub/react-context';

import Signin, { values } from '../Signin';

let handleRedirectCallback: undefined | Auth0['handleRedirectCallback'];
const renderSignin = async (): Promise<RenderResult> => {
  const GrabHandleRedirectCallback: React.FC = () => {
    const auth0 = useAuth0GP2();
    useEffect(() => {
      ({ handleRedirectCallback } = auth0);
      return () => {
        handleRedirectCallback = undefined;
      };
    }, [auth0]);
    return null;
  };

  const result = render(
    <StaticRouter location="/page?search#hash">
      <authTestUtils.UserAuth0Provider>
        <GrabHandleRedirectCallback />
        <Signin />
      </authTestUtils.UserAuth0Provider>
    </StaticRouter>,
  );
  await waitFor(() => !!result.container.textContent);
  return result;
};

const { mockGetLocation, mockAssign } = mockLocation();
beforeEach(() => {
  mockGetLocation.mockReturnValue(new URL('http://localhost/page?search#hash'));
});

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

let nonce = '';
beforeEach(() => {
  nonce = '';
  nock('https://auth.example.com')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Auth0-Client',
      'access-control-allow-credentials': 'true',
    })
    .options('/oauth/token')
    .reply(200)
    .post('/oauth/token')
    .reply(200, (_uri, _body, cb) =>
      cb(null, {
        id_token: sign(
          {
            nonce,
            sub: 'auth0|42',
            aud: 'client_id',
            iss: 'https://auth.example.com/',
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          },
          privateKey,
          { algorithm: 'RS256' },
        ),
      }),
    );
});
afterEach(() => {
  nock.cleanAll();
});

it('renders a button to signin', async () => {
  const { getByRole } = render(
    <StaticRouter>
      <Signin />
    </StaticRouter>,
  );
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

it('renders the footer with terms and conditions', async () => {
  const { getByText } = await renderSignin();
  expect(
    getByText(/By signing in you are agreeing to our/i),
  ).toBeInTheDocument();
  expect(getByText('Terms and Conditions')).toBeInTheDocument();
  expect(getByText('Privacy Notice')).toBeInTheDocument();
});

it('renders the signup footer when allowSignup is true', () => {
  const handleClick = jest.fn();
  render(<WelcomePage allowSignup onClick={handleClick} values={values} />);
  expect(
    screen.getByText(/By proceeding you are agreeing to our/i),
  ).toBeInTheDocument();
});

describe('when clicking the button', () => {
  beforeEach(async () => {
    const { getByText } = await renderSignin();
    userEvent.click(getByText(/sign\sin/i));
  });

  it('redirects to the Auth0 signin page', async () => {
    await waitFor(() => expect(mockAssign).toHaveBeenCalledTimes(1));

    const { origin, pathname, searchParams } = new URL(
      mockAssign.mock.calls[0]![0],
    );
    expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
    expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
    expect(searchParams.get('prompt')).toBe('login');
  });

  describe('and returning from the flow', () => {
    beforeEach(async () => {
      await waitFor(() => {
        if (mockAssign.mock.calls.length !== 1) throw new Error();
      });
      const { searchParams } = new URL(mockAssign.mock.calls[0]![0]);
      nonce = searchParams.get('nonce')!;
      mockAssign.mockClear();

      mockGetLocation.mockReturnValue(
        new URL(
          `http://localhost/?code=code&state=${encodeURIComponent(
            searchParams.get('state')!,
          )}`,
        ),
      );
    });

    it('has the original location saved in the appState', async () => {
      const { appState } = await handleRedirectCallback!();
      expect(appState).toHaveProperty('targetUrl', '/page?search#hash');
    });
  });
});

describe('after a failed flow', () => {
  let history: History;
  let result!: RenderResult;
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: [
        '/?search&state=state&error=access_denied&error_description=Forbidden',
      ],
    });
    result = render(
      <Router history={history}>
        <Signin />
      </Router>,
    );
  });

  it('shows an error message', () => {
    expect(result.container).toHaveTextContent(/problem/i);
  });

  describe('when closing the error message', () => {
    beforeEach(() => {
      userEvent.click(result.getByText('Close'));
    });

    it('hides the error message', () => {
      expect(result.container).not.toHaveTextContent(/problem/i);
    });

    it('removes related query params', () => {
      const searchParams = new URLSearchParams(history.location.search);
      expect([...searchParams.keys()]).toEqual(['search']);
    });
  });
});
