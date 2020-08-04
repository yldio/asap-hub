import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { authTestUtils } from '@asap-hub/react-components';

import Signin from '../Signin';

const renderSignin = async (): Promise<RenderResult> => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <Signin />
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => !!result.container.textContent);
  return result;
};

// redirect
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

it('renders a button to signin', async () => {
  const { getByRole } = render(<Signin />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

describe('when clicking the button', () => {
  it('redirects to the signup page', async () => {
    const { getByRole } = await renderSignin();
    userEvent.click(getByRole('button'));
    await waitFor(() => expect(assign).toHaveBeenCalled());

    const { origin, pathname, searchParams } = new URL(assign.mock.calls[0][0]);
    expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
    expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
    expect(searchParams.get('prompt')).toBe('login');
  });
});
