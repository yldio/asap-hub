import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import OnboardingFooter from '../OnboardingFooter';

const props: ComponentProps<typeof OnboardingFooter> = {
  onboardable: { isOnboardable: false },
};
it('renders the not onboardable footer', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingFooter {...props} onboardable={{ isOnboardable: false }} />,
  );
  expect(getByTitle(/lock/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ incomplete/i);
});

it('renders the onboardable footer', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingFooter {...props} onboardable={{ isOnboardable: true }} />,
  );
  expect(getByTitle(/success/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
