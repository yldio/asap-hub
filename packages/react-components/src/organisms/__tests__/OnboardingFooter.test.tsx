import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import OnboardingFooter from '../OnboardingFooter';

const props: ComponentProps<typeof OnboardingFooter> = {
  onboardable: { steps: [], isOnboardable: false },
};
it('renders the not onboardable footer', () => {
  const { getByRole } = render(
    <OnboardingFooter
      {...props}
      onboardable={{ steps: [], isOnboardable: false }}
    />,
  );
  expect(getByRole('heading')).toHaveTextContent(/ incomplete/i);
});

it('renders the onboardable footer', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingFooter
      {...props}
      onboardable={{ steps: [], isOnboardable: true }}
    />,
  );
  expect(getByTitle(/success/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
