import React, { useEffect } from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JWK, JWT } from 'jose';

import nock from 'nock';

import { authTestUtils } from '@asap-hub/react-components';
import { Auth0 } from '@asap-hub/auth';
import { useAuth0 } from '@asap-hub/react-context';

import Signin from '../Signin';

let handleRedirectCallback: undefined | Auth0['handleRedirectCallback'];
const renderSignin = async (): Promise<RenderResult> => {
  const GrabHandleRedirectCallback: React.FC = () => {
    const auth0 = useAuth0();
    useEffect(() => {
      ({ handleRedirectCallback } = auth0);
      return () => {
        handleRedirectCallback = undefined;
      };
    }, [auth0]);
    return null;
  };

  const result = render(
    <authTestUtils.Auth0Provider>
      <GrabHandleRedirectCallback />
      <Signin />
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => !!result.container.textContent);
  return result;
};

const originalLocation = globalThis.location;
const mockLocation = jest.fn();
const assign = jest.fn();
beforeEach(() => {
  mockLocation
    .mockReset()
    .mockReturnValue(new URL('http://localhost/page?search#hash'));
  assign.mockClear();

  delete globalThis.location;
  class MockUrl extends URL {
    assign = assign;
  }
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    get: () => new MockUrl(mockLocation()),
  });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    value: originalLocation,
  });
});

let nonce = '';
beforeEach(() => {
  nonce = '';
  nock('https://auth.example.com')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post('/oauth/token')
    .reply(200, (_uri, _body, cb) =>
      cb(null, {
        /* eslint-disable @typescript-eslint/camelcase */
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
});

it('renders a button to signin', async () => {
  const { getByRole } = render(<Signin />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

describe('when clicking the button', () => {
  beforeEach(async () => {
    const { getByText } = await renderSignin();
    userEvent.click(getByText(/sign.+in/i));
  });

  it('redirects to the Auth0 signin page', async () => {
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));

    const { origin, pathname, searchParams } = new URL(assign.mock.calls[0][0]);
    expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
    expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
    expect(searchParams.get('prompt')).toBe('login');
  });

  describe('and returning from the flow', () => {
    beforeEach(async () => {
      await waitFor(() => {
        if (assign.mock.calls.length !== 1) throw new Error();
      });
      const { searchParams } = new URL(assign.mock.calls[0][0]);
      nonce = searchParams.get('nonce')!;
      assign.mockClear();

      mockLocation.mockReturnValue(
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
