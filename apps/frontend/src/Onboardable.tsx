import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';

import { useOnboarding, OnboardingStep } from './hooks';

type OnboardableResult = {
  steps: OnboardingStep[];
  isOnboardable: boolean;
};

export type OnboardableLoadUserProps = {
  id: string;
  children: (state: OnboardableResult) => ReactNode;
};
const OnboardableLoadUser: FC<OnboardableLoadUserProps> = ({
  id,
  children,
}) => {
  const onboardingState = useOnboarding(id);

  return <>{children(onboardingState)}</>;
};

type OnboardableProps = {
  children: (state?: OnboardableResult) => ReactNode;
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
