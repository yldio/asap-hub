import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import OnboardingFooter from '../OnboardingFooter';

const props: ComponentProps<typeof OnboardingFooter> = {
  onboardable: { steps: [], isOnboardable: false },
};
it('renders the not onboardable UI, when profile incomplete', () => {
  const { getByRole, getByText } = render(
    <OnboardingFooter
      {...props}
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
    <OnboardingFooter
      {...props}
      onboardable={{ steps: [], isOnboardable: true }}
    />,
  );
  expect(getByTitle(/success/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
});
