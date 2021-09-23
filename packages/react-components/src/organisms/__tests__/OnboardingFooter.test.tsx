import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import OnboardingFooter from '../OnboardingFooter';

const props: ComponentProps<typeof OnboardingFooter> = {
  onboardable: {
    incompleteSteps: [],
    totalSteps: 5,
    isOnboardable: true,
  },
  onboardModalHref: '/example',
};
it('does not renders when onboarding modal href is omitted', () => {
  const { queryByRole } = render(
    <OnboardingFooter {...props} onboardModalHref={undefined} />,
  );
  expect(queryByRole('link')).toBeNull();
});

it('does not render when onboardable is omitted', () => {
  const { queryByRole } = render(
    <OnboardingFooter {...props} onboardable={undefined} />,
  );
  expect(queryByRole('link')).toBeNull();
});

it('shows the total number of steps, no steps completed messaging and next step button when no steps are completed', () => {
  const { getByRole, getByText } = render(
    <OnboardingFooter
      {...props}
      onboardable={{
        incompleteSteps: [
          { label: 'Role', modalHref: '/' },
          { label: 'Role 1', modalHref: '/' },
          { label: 'Role 2', modalHref: '/' },
          { label: 'Role 3', modalHref: '/' },
          { label: 'Role 4', modalHref: '/' },
        ],
        totalSteps: 5,
        isOnboardable: false,
      }}
    />,
  );
  expect(getByRole('heading')).toHaveTextContent(/start completing/i);
  expect(getByText(/Complete 5 steps/i)).toBeInTheDocument();
  expect(getByRole('link').textContent).toEqual('Next Step: Role');
});

it('shows the percentage of completed steps', () => {
  const { getByRole, getByText, rerender } = render(
    <OnboardingFooter
      {...props}
      onboardable={{
        incompleteSteps: [
          { label: 'Role 1', modalHref: '/' },
          { label: 'Role 2', modalHref: '/' },
          { label: 'Role 3', modalHref: '/' },
          { label: 'Role 4', modalHref: '/' },
        ],
        totalSteps: 5,
        isOnboardable: false,
      }}
    />,
  );
  expect(getByText(/Complete your profile/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/is 20% complete/i);
  expect(getByRole('link').textContent).toEqual('Next Step: Role 1');

  rerender(
    <OnboardingFooter
      {...props}
      onboardable={{
        incompleteSteps: [
          { label: 'Role 2', modalHref: '/' },
          { label: 'Role 3', modalHref: '/' },
          { label: 'Role 4', modalHref: '/' },
        ],
        totalSteps: 5,
        isOnboardable: false,
      }}
    />,
  );
  expect(getByText(/Complete your profile/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/is 40% complete/i);
  expect(getByRole('link').textContent).toEqual('Next Step: Role 2');
});

it('shows the last step messaging and next step button when there is 1 incomplete step', () => {
  const { getByRole, getByText } = render(
    <OnboardingFooter
      {...props}
      onboardable={{
        incompleteSteps: [{ label: 'Role 4', modalHref: '/' }],
        totalSteps: 5,
        isOnboardable: false,
      }}
    />,
  );
  expect(getByText(/last step/i)).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/is \d+% complete/i);
  expect(getByRole('link').textContent).toEqual('Next Step: Role 4');
});

it('provides a link to the complete onboarding modal and copy when all steps have been completed', () => {
  const { getByRole, getByTitle } = render(
    <OnboardingFooter
      {...props}
      onboardModalHref="/complete-onboarding"
      onboardable={{
        incompleteSteps: [],
        totalSteps: 5,
        isOnboardable: true,
      }}
    />,
  );
  expect(getByTitle('Success')).toBeInTheDocument();
  expect(getByRole('heading')).toHaveTextContent(/ complete/i);
  expect(getByRole('link')).toHaveTextContent(/publish/i);
  expect(getByRole('link')).toHaveAttribute('href', '/complete-onboarding');
});
