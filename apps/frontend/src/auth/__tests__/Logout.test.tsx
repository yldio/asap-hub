import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import Logout from '../Logout';

const originalLocation = globalThis.location;
let assign: jest.MockedFunction<typeof globalThis.location.assign>;
beforeEach(() => {
  assign = jest.fn();
  delete globalThis.location;
  globalThis.location = { ...originalLocation, assign };
});
afterEach(() => {
  globalThis.location = originalLocation;
});

it('redirects to the logout URL', async () => {
  render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <Logout />
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => expect(assign).toHaveBeenCalled());

  const { origin, pathname, searchParams } = new URL(assign.mock.calls[0][0]);
  expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
  expect(pathname).toMatchInlineSnapshot(`"/v2/logout"`);
  expect(searchParams.get('client_id')).toMatchInlineSnapshot(`"client_id"`);
  expect(searchParams.get('returnTo')).toMatchInlineSnapshot(
    `"http://localhost"`,
  );
});
