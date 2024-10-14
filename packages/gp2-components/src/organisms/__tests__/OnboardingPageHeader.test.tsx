import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPageHeader from '../OnboardingPageHeader';

const renderWithRouter = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('OnboardingPageHeader', () => {
  it('renders the header title', () => {
    renderWithRouter(<OnboardingPageHeader steps={[]} />);
    expect(
      screen.getByRole('heading', { name: /registration/i }),
    ).toBeVisible();
  });

  it('renders the progression levels', async () => {
    renderWithRouter(
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
    );
    expect(screen.getByRole('link', { name: /core details/i })).toBeVisible();
  });
});
