import { render, screen } from '@testing-library/react';
import OnboardingPageHeader from '../OnboardingPageHeader';

describe('OnboardingPageHeader', () => {
  it('renders the header title', () => {
    render(<OnboardingPageHeader currentIndex={0} />);
    expect(
      screen.getByRole('heading', { name: /registration/i }),
    ).toBeVisible();
  });

  it('renders the progression levels', async () => {
    render(<OnboardingPageHeader currentIndex={0} />);
    expect(screen.getByRole('link', { name: /core details/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /background/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /gp2 groups/i })).toBeVisible();
    expect(
      screen.getByRole('link', { name: /additional details/i }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /preview/i })).toBeVisible();
  });
});
