import { mockLocation } from '@asap-hub/dom-test-utils';
import { authTestUtils } from '@asap-hub/react-components';
import { render, waitFor } from '@testing-library/react';

import Logout from '../Logout';

const { mockAssign } = mockLocation();

it('redirects to the logout URL', async () => {
  render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserWhenReady>
        <authTestUtils.UserLoggedIn user={undefined}>
          <Logout />
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserWhenReady>
    </authTestUtils.UserAuth0Provider>,
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
