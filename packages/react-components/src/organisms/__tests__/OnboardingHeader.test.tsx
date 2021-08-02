import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import OnboardingHeader from '../OnboardingHeader';

const props: ComponentProps<typeof OnboardingHeader> = {
  onboardable: { isOnboardable: false },
};
it('renders the not onboardable header', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingHeader {...props} onboardable={{ isOnboardable: false }} />,
  );
  expect(getByTitle(/lock/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ incomplete/i);
});

it('renders the onboardable header', () => {
  const { getByTitle, getByRole } = render(
    <OnboardingHeader {...props} onboardable={{ isOnboardable: true }} />,
  );
  expect(getByTitle(/tick/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
