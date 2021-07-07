import { render } from '@testing-library/react';
import OnboardingHeader from '../OnboardingHeader';

it('renders the Onboarding Header', () => {
  const { container } = render(<OnboardingHeader onboardable={false} />);
  expect(container).toBeVisible();
});
