import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OnboardingBackground from '../OnboardingBackground';

const { createUserResponse } = gp2;

it('renders the page description', () => {
  const defaultProps = {
    ...createUserResponse(),
    editBiographyHref: '',
    editKeywordsHref: '',
  };
  render(<OnboardingBackground {...defaultProps} />);
  expect(
    screen.getByText(/next up, we’d like to capture some more information/i),
  ).toBeVisible();
});

it('renders the keywords card', () => {
  const defaultProps = {
    ...createUserResponse(),
    editBiographyHref: '',
    editKeywordsHref: '',
  };
  render(<OnboardingBackground {...defaultProps} />);
  expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
});
it('renders the biography card', () => {
  const defaultProps = {
    ...createUserResponse(),
    editBiographyHref: '',
    editKeywordsHref: '',
  };
  render(<OnboardingBackground {...defaultProps} />);
  expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
});
