import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OnboardingAdditionalDetails from '../OnboardingAdditionalDetails';

const { createUserResponse } = gp2;

describe('OnboardingAdditionalDetails', () => {
  const defaultProps = {
    ...createUserResponse(),
    editQuestionsHref: '',
    editFundingStreamsHref: '',
    editContributingCohortsHref: '',
  };

  it('renders the page description', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByText(
        /Adding additional details to your profile will inform/i,
      ),
    ).toBeVisible();
  });

  it.each([
    'Open Questions',
    'Financial Disclosures',
    'Contributing Cohort Studies',
  ])('renders the %s card', (name) => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(screen.getByRole('heading', { name })).toBeVisible();
  });
});
