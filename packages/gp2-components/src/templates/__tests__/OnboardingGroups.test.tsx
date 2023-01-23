import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OnboardingGroups from '../OnboardingGroups';

const { createUserResponse } = gp2;

describe('OnboardingGroups', () => {
  const defaultProps = {
    ...createUserResponse(),
  };
  it('renders the page description', () => {
    render(<OnboardingGroups {...defaultProps} />);
    expect(
      screen.getByText(
        /you’ve already been added to the following groups within the gp2 network/i,
      ),
    ).toBeVisible();
  });
  it('renders the Projects card', () => {
    render(<OnboardingGroups {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });
  it('renders the Working Groups card', () => {
    render(<OnboardingGroups {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Working Groups' }),
    ).toBeVisible();
  });
});
