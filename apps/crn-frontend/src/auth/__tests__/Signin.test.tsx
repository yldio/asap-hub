import { render, RenderResult, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { JWK, JWT } from 'jose';
import { useEffect } from 'react';
import { Router, StaticRouter } from 'react-router-dom';

import nock from 'nock';

import { Auth0 } from '@asap-hub/auth';
import { mockLocation } from '@asap-hub/dom-test-utils';
import { authTestUtils } from '@asap-hub/react-components';
import { useAuth0CRN } from '@asap-hub/react-context';

import Signin from '../Signin';

let handleRedirectCallback: undefined | Auth0['handleRedirectCallback'];
const renderSignin = async (): Promise<RenderResult> => {
  const GrabHandleRedirectCallback: React.FC = () => {
    const auth0 = useAuth0CRN();
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

  await waitFor(() => {
    expect(result.container.textContent).toBeTruthy();
  });

  await waitFor(() => {
    const loadingText = result.queryByText(/loading/i);
    expect(loadingText).not.toBeInTheDocument();
  });

  return result;
};

const { mockGetLocation, mockAssign } = mockLocation();
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  mockGetLocation.mockReturnValue(new URL('http://localhost/page?search#hash'));
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
        id_token: JWT.sign({ nonce }, JWK.generateSync('RSA'), {
          algorithm: 'RS256',
          subject: 'auth0|42',
          audience: 'client_id',
          issuer: 'https://auth.example.com/',
          expiresIn: '24h',
        }),
      }),
    );
});
afterEach(() => {
  nock.cleanAll();
  jest.restoreAllMocks();
});

it('renders a button to signin', async () => {
  const { getByRole } = render(
    <StaticRouter>
      <Signin />
    </StaticRouter>,
  );
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

describe('when clicking the button', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    // Setup userEvent for React 18 compatibility
    user = userEvent.setup();

    const { getByText } = await renderSignin();

    // Wait a bit more to ensure Auth0 is fully ready
    await waitFor(() => {
      expect(getByText(/sign\sin/i)).toBeEnabled();
    });

    // Use async click for React 18 compatibility
    await act(async () => {
      await user.click(getByText(/sign\sin/i));
    });
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
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('for an unknown error', () => {
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
      expect(result.container).toHaveTextContent(/problem with your account/i);
    });

    describe('when closing the error message', () => {
      beforeEach(async () => {
        await act(async () => {
          await user.click(result.getByText('Close'));
        });
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

  describe('for an alumni error', () => {
    beforeEach(() => {
      history = createMemoryHistory({
        initialEntries: [
          '/?search&state=state&error=access_denied&error_description=alumni-user-access-denied',
        ],
      });
      result = render(
        <Router history={history}>
          <Signin />
        </Router>,
      );
    });

    it('shows an error message and contact info', () => {
      expect(result.container).toHaveTextContent(/Alumni user/i);
      expect(result.container).toHaveTextContent(/for further assistance/i);
    });
  });
});
