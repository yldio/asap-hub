import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';
import { isUserOnboardable } from '@asap-hub/validation';

import { useUserByIdLoadable } from './network/users/state';

type OnboardableResult = ReturnType<typeof isUserOnboardable> | undefined;

type OnboardableLoadUserProps = {
  id: string;
  children: (state: OnboardableResult) => ReactNode;
};
const OnboardableLoadUser: FC<OnboardableLoadUserProps> = ({
  id,
  children,
}) => {
  const result = useUserByIdLoadable(id);
  const isOnboardable =
    result.state === 'hasValue' && result.contents
      ? isUserOnboardable(result.contents).isOnboardable
      : false;
  return <>{children({ isOnboardable })}</>;
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
