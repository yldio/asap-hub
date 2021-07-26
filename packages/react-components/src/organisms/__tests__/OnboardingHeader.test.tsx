import { render } from '@testing-library/react';
import OnboardingHeader from '../OnboardingHeader';

it('renders the not onboardable header', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingHeader isOnboardable={false} />,
  );
  expect(getByTitle(/lock/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ incomplete/i);
});

it('renders the onboardable header', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingHeader isOnboardable={true} />,
  );
  expect(getByTitle(/tick/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
