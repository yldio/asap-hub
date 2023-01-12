import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingPage } from '..';

describe('OnboardingPage', () => {
  const defaultProps = {
    steps: [],
    publishUser: jest.fn(),
    isContinueEnabled: false,
  };
  it('renders the header', () => {
    render(<OnboardingPage {...defaultProps} />, { wrapper: MemoryRouter });
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the children', () => {
    render(<OnboardingPage {...defaultProps}>Children</OnboardingPage>, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByText('Children')).toBeVisible();
  });
  it('renders the footer', () => {
    render(<OnboardingPage {...defaultProps} />, { wrapper: MemoryRouter });
    expect(screen.getByRole('contentinfo')).toBeVisible();
  });
});
