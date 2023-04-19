import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OnboardingPreview from '../OnboardingPreview';

const { createUserResponse } = gp2;

describe('OnboardingPreview', () => {
  const editHrefs = {
    editKeyInfoHref: '',
    editContactInfoHref: '',
    editBiographyHref: '',
    editKeywordsHref: '',
    editQuestionsHref: '',
    editFundingStreamsHref: '',
    editContributingCohortsHref: '',
    editExternalProfilesHref: '',
  };
  const defaultProps = {
    ...createUserResponse(),
    ...editHrefs,
  };

  it('renders the page description', () => {
    render(<OnboardingPreview {...defaultProps} />);
    expect(
      screen.getByText(/It’s time to preview what your profile/i),
    ).toBeVisible();
  });

  it('renders the avatar', () => {
    const user = createUserResponse({
      firstName: 'Tony',
      lastName: 'Stark',
    });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(
      screen.getByRole('img', { name: /Profile picture of Tony Stark/i }),
    ).toBeInTheDocument();
  });

  it('renders the full name', () => {
    const displayName = 'Anthony Edward Stark';
    const user = createUserResponse({ displayName });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(
      screen.getByRole('heading', { name: /Anthony Edward Stark/i }),
    ).toBeInTheDocument();
  });

  it('renders the degrees', () => {
    const user = createUserResponse({ degrees: ['BSc', 'MSc'] });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(
      screen.getByRole('heading', { name: /BSc, MSc/i }),
    ).toBeInTheDocument();
  });

  it('renders the region', () => {
    const user = createUserResponse({ region: 'Africa' });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(
      screen.getByText('Africa', { selector: 'span' }),
    ).toBeInTheDocument();
  });

  it('renders the city and country', () => {
    const user = createUserResponse({ city: 'London', country: 'UK' });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(screen.getByText('London, UK')).toBeInTheDocument();
  });

  it('renders the positions', () => {
    const user = createUserResponse({
      positions: [
        {
          role: 'CEO',
          department: 'Research',
          institution: 'Stark Enterprises',
        },
      ],
    });
    render(<OnboardingPreview {...user} {...editHrefs} />);
    expect(
      screen.getByText('CEO in Research at Stark Enterprises'),
    ).toBeInTheDocument();
  });

  it.each([
    'Biography',
    'Keywords',
    'Projects',
    'Working Groups',
    'Open Questions',
    'Financial Disclosures',
    'Contributing Cohort Studies',
    'External Profiles',
  ])('renders the %s card', (name) => {
    render(<OnboardingPreview {...defaultProps} />);
    expect(screen.getByRole('heading', { name })).toBeVisible();
  });
});
