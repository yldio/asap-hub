import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingPage } from '..';

describe('OnboardingPage', () => {
  const defaultProps = {
    steps: [],
    publishHref: '/publish',
    isContinueEnabled: false,
  };
  const renderWithRouter = (children: ReactNode) =>
    render(<MemoryRouter>{children}</MemoryRouter>);

  it('renders the header', () => {
    renderWithRouter(<OnboardingPage {...defaultProps} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the children', () => {
    renderWithRouter(
      <OnboardingPage {...defaultProps}>Children</OnboardingPage>,
    );
    expect(screen.getByText('Children')).toBeVisible();
  });
  it('renders the footer', () => {
    renderWithRouter(<OnboardingPage {...defaultProps} />);
    expect(screen.getByRole('contentinfo')).toBeVisible();
  });
});
