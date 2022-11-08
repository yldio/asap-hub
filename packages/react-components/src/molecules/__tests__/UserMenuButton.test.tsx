import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMenuButton from '../UserMenuButton';

it('renders a button', () => {
  render(<UserMenuButton />);
  expect(screen.getByRole('button')).toBeVisible();
});

it('renders the display name when no children is provided', () => {
  render(<UserMenuButton displayName={'John Doe'} />);
  expect(screen.getByText('John Doe')).toBeVisible();
});

it('renders the children when is provided', () => {
  render(<UserMenuButton displayName={'John Doe'}>Hi, Jimi</UserMenuButton>);
  expect(screen.getByText('Hi, Jimi')).toBeVisible();
});

it('renders a fallback instead of the display name', () => {
  render(<UserMenuButton />);
  expect(screen.getByText(/unknown/i)).toBeVisible();
});

it('renders the user avatar', () => {
  render(
    <UserMenuButton
      avatarUrl={'/pic.jpg'}
      firstName={'John'}
      lastName={'Doe'}
    />,
  );
  expect(screen.getByLabelText(/pic.+John Doe/i)).toBeVisible();
});
it('renders a fallback for the user avatar', () => {
  render(<UserMenuButton />);
  expect(screen.getByText(/^[A-Z]{2}$/).textContent).toMatchInlineSnapshot(
    `"UU"`,
  );
});

it('changes the chevron direction based on open state', () => {
  const { rerender } = render(<UserMenuButton />);
  expect(screen.getByTitle(/chevron/i).title).toMatchInlineSnapshot(
    `undefined`,
  );

  rerender(<UserMenuButton open />);
  expect(screen.getByTitle(/chevron/i).title).toMatchInlineSnapshot(
    `undefined`,
  );
});

it('triggers the click event', () => {
  const handleClick = jest.fn();
  render(<UserMenuButton onClick={handleClick} />);

  userEvent.click(screen.getByLabelText(/toggle.+user menu/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
