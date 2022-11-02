import { render, screen } from '@testing-library/react';
import OnboardWelcome from '../OnboardWelcome';

it('renders the header', () => {
  render(<OnboardWelcome />);
  expect(screen.getAllByRole('heading')[0]).toBeVisible();
  expect(screen.getAllByRole('heading')[0].textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub"`,
  );
});
