import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserMenuButton from '../UserMenuButton';
import { authTestUtils } from '../..';

it('renders a button', () => {
  const { getByRole } = render(<UserMenuButton />);
  expect(getByRole('button')).toBeVisible();
});

it('renders the display name when no children is provided', async () => {
  const { findByText } = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn user={{ displayName: 'John Doe' }}>
        <UserMenuButton />
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  expect(await findByText('John Doe')).toBeVisible();
});

it('renders the children when is provided', async () => {
  const { findByText } = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn user={{ displayName: 'John Doe' }}>
        <UserMenuButton>Hi, Jimi</UserMenuButton>
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  expect(await findByText('Hi, Jimi')).toBeVisible();
});

it('renders a fallback instead of the display name', async () => {
  const { findByText } = render(<UserMenuButton />);
  expect(await findByText(/unknown/i)).toBeVisible();
});

it('renders the user avatar', async () => {
  const { findByLabelText } = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn
        user={{ avatarUrl: '/pic.jpg', firstName: 'John', lastName: 'Doe' }}
      >
        <UserMenuButton />
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  expect(await findByLabelText(/pic.+John Doe/i)).toBeVisible();
});
it('renders a fallback for the user avatar', async () => {
  const { findByText } = render(<UserMenuButton />);
  expect((await findByText(/^[A-Z]{2}$/)).textContent).toMatchInlineSnapshot(
    `"UU"`,
  );
});

it('changes the chevron direction based on open state', () => {
  const { getByTitle, rerender } = render(<UserMenuButton />);
  expect(getByTitle(/chevron/i).title).toMatchInlineSnapshot(`undefined`);

  rerender(<UserMenuButton open />);
  expect(getByTitle(/chevron/i).title).toMatchInlineSnapshot(`undefined`);
});

it('triggers the click event', () => {
  const handleClick = jest.fn();
  const { getByLabelText } = render(<UserMenuButton onClick={handleClick} />);

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
