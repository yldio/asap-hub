import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';
import { isUserOnboardable } from '@asap-hub/validation';

import { useOnboarding, OnboardingStep } from './hooks';

type OnboardableResult = ReturnType<typeof isUserOnboardable> | undefined;

export type OnboardableLoadUserProps = {
  id: string;
  children: (state: {
    steps: OnboardingStep[];
    isOnboardable: boolean;
  }) => ReactNode;
};
const OnboardableLoadUser: FC<OnboardableLoadUserProps> = ({
  id,
  children,
}) => {
  const onboardingState = useOnboarding(id);

  return <>{children(onboardingState)}</>;
};

type OnboardableProps = {
  children: (state: OnboardableResult) => ReactNode;
};
export const Onboardable: FC<OnboardableProps> = ({ children }) => {
  const auth0user = useCurrentUser();
  if (auth0user && !auth0user.onboarded) {
    return (
      <OnboardableLoadUser id={auth0user.id}>
        {(state) => children(state)}
      </OnboardableLoadUser>
    );
  }
  return <>{children(undefined)}</>;
};

export default Onboardable;
