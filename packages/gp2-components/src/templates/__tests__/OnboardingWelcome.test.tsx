import { render, screen } from '@testing-library/react';
import OnboardingWelcome from '../OnboardingWelcome';

it('renders the header', () => {
  render(<OnboardingWelcome />);
  expect(
    screen.getByRole('heading', { name: /Welcome to the GP2 Hub/i }),
  ).toBeVisible();
});

it('Sign out button takes you to the logout', () => {
  render(<OnboardingWelcome />);
  const signOutButton = screen.getByRole('link', { name: /Sign Out/i });
  expect(signOutButton.closest('a')).toHaveAttribute('href', '/logout');
});
