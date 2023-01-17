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
    editExternalProfilesHref: '',
  };

  it('renders the page description', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByText(/Adding additional details to your profile will help/i),
    ).toBeVisible();
  });

  it('renders the questions card', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Open Questions' }),
    ).toBeVisible();
  });

  it('renders the funding providers card', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Funding Providers' }),
    ).toBeVisible();
  });

  it('renders the contributing cohorts', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
    ).toBeVisible();
  });

  it('renders the external profiles card', () => {
    render(<OnboardingAdditionalDetails {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'External Profiles' }),
    ).toBeVisible();
  });
});
