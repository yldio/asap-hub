import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPageHeader from '../OnboardingPageHeader';

describe('OnboardingPageHeader', () => {
  it('renders the header title', () => {
    render(<OnboardingPageHeader steps={[]} />, {
      wrapper: MemoryRouter,
    });
    expect(
      screen.getByRole('heading', { name: /registration/i }),
    ).toBeVisible();
  });

  it('renders the progression levels', async () => {
    render(
      <OnboardingPageHeader
        steps={[
          {
            href: '/',
            name: 'Core Details',
            disabled: false,
            completed: false,
          },
        ]}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(screen.getByRole('link', { name: /core details/i })).toBeVisible();
  });
});
