import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';

import { useOnboarding, UserOnboardingResult } from './hooks';

export type OnboardableLoadUserProps = {
  id: string;
  children: (state?: UserOnboardingResult) => ReactNode;
};
const OnboardableLoadUser: FC<OnboardableLoadUserProps> = ({
  id,
  children,
}) => {
  const onboardingState = useOnboarding(id);
  return <>{children(onboardingState)}</>;
};

type OnboardableProps = {
  children: (state?: UserOnboardingResult) => ReactNode;
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
