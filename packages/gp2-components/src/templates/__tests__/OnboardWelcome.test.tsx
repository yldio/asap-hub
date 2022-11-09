import { render, screen } from '@testing-library/react';
import OnboardWelcome from '../OnboardWelcome';

it('renders the header', () => {
  render(<OnboardWelcome />);
  expect(
    screen.getByRole('heading', { name: /Welcome to the GP2 Hub/i }),
  ).toBeVisible();
});

it('Sign out button takes you to the logout', () => {
  render(<OnboardWelcome />);
  const signOutButton = screen.getByRole('link', { name: /Sign Out/i });
  expect(signOutButton.closest('a')).toHaveAttribute('href', '/logout');
});
