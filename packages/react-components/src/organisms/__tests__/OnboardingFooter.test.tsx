import { render } from '@testing-library/react';
import OnboardingFooter from '../OnboardingFooter';

it('renders the button, after validate onboarding', () => {
  const { container } = render(
    <OnboardingFooter
      onboardable={{
        steps: [],
        isOnboardable: false,
      }}
    />,
  );
  expect(container.querySelector('button')).toBeNull();
});

it('renders the not onboardable UI, when profile incomplete', () => {
  const { getByRole, getByText } = render(
    <OnboardingFooter
      onboardable={{
        steps: [{ label: 'Role', modalHref: '/' }],
        isOnboardable: false,
      }}
    />,
  );
  expect(getByRole('heading')).toHaveTextContent(/incomplete/i);
  expect(getByText(/step/i).textContent).toEqual('Next Step: Role');
});

it('renders the not onboardable UI, when profile complete', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingFooter onboardable={{ steps: [], isOnboardable: true }} />,
  );
  expect(getByTitle(/success/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
