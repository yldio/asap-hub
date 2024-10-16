import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPageFooter from '../OnboardingPageFooter';

const renderWithRouter = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('OnboardingPageFooter', () => {
  const defaultProps = {
    isContinueEnabled: false,
    publishHref: '/publish',
  };
  it('renders the links with the right props', () => {
    renderWithRouter(
      <OnboardingPageFooter
        {...defaultProps}
        previousHref="/previous"
        continueHref="/next"
        isContinueEnabled
      />,
    );
    const links = screen.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(({ textContent }) => textContent)).toMatchObject([
      expect.stringMatching('Sign Out'),
      expect.stringMatching('Previous'),
      expect.stringMatching('Continue'),
    ]);
    expect(links.map(({ href }) => href)).toMatchObject([
      expect.stringMatching('/logout'),
      expect.stringMatching('/previous'),
      expect.stringMatching('/next'),
    ]);
  });
  it('renders publish button if theres no continueHref', () => {
    renderWithRouter(
      <OnboardingPageFooter
        {...defaultProps}
        continueHref={undefined}
        isContinueEnabled
      />,
    );
    expect(
      screen.queryByRole('link', { name: 'Continue' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Publish' })).toBeVisible();
  });
});
