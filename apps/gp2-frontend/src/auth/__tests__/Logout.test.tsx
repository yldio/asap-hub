import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { mockLocation } from '@asap-hub/dom-test-utils';

import Logout from '../Logout';

const { mockAssign } = mockLocation();

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
  await waitFor(() => expect(mockAssign).toHaveBeenCalled());

  const { origin, pathname, searchParams } = new URL(
    mockAssign.mock.calls[0][0],
  );
  expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
  expect(pathname).toMatchInlineSnapshot(`"/v2/logout"`);
  expect(searchParams.get('client_id')).toMatchInlineSnapshot(`"client_id"`);
  expect(searchParams.get('returnTo')).toMatchInlineSnapshot(
    `"http://localhost"`,
  );
});

it('can still be rendered without authentication', async () => {
  const { findByText } = render(<Logout />);
  expect(await findByText(/log.*out/i)).toBeVisible();
});
