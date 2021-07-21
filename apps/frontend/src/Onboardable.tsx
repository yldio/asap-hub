import { FC, ReactNode } from 'react';
import { useCurrentUser } from '@asap-hub/react-context';
import { isUserOnboardable } from '@asap-hub/validation';
import { useRecoilState } from 'recoil';

import { useUserByIdLoadable } from './network/users/state';
import { auth0State } from './auth/state';

type OnboardableLoadUserProps = {
  id: string;
  children: (state: { isOnboardable: boolean }) => ReactNode;
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
  children: (state: { isOnboardable: boolean | null }) => ReactNode;
};
export const Onboardable: FC<OnboardableProps> = ({ children }) => {
  const auth0user = useCurrentUser();
  const [auth0] = useRecoilState(auth0State);
  if (auth0user && !auth0user.onboarded) {
    if (auth0) {
      return (
        <OnboardableLoadUser id={auth0user.id}>
          {(state) => children(state)}
        </OnboardableLoadUser>
      );
    }
    return <>{children({ isOnboardable: false })}</>;
  }
  return <>{children({ isOnboardable: null })}</>;
};

export default Onboardable;
