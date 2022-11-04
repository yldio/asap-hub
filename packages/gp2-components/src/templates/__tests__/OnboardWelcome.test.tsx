import { render, screen } from '@testing-library/react';
import OnboardWelcome from '../OnboardWelcome';

it('renders the header', () => {
  render(<OnboardWelcome />);
  expect(
    screen.getByText('Welcome to the GP2 Hub', { selector: 'h2' }),
  ).toBeVisible();
});

it('Sign out button takes you to the logout', () => {
  render(<OnboardWelcome />);
  const signOutButton = screen.getByRole('link', { name: /Sign Out/i });
  expect(signOutButton.closest('a')).toHaveAttribute('href', '/logout');
});
