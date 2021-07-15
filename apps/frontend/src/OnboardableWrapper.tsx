import { FC } from 'react';
import { useCurrentUser, OnboardableContext } from '@asap-hub/react-context';
import { isUserOnboardable } from '@asap-hub/validation';
import { useRecoilState } from 'recoil';

import { useUserByIdLoadable } from './network/users/state';
import { auth0State } from './auth/state';

const LoadUserData: FC<{ id: string }> = ({ id, children }) => {
  const result = useUserByIdLoadable(id);
  const isOnboardable =
    result.state === 'hasValue' && result.contents
      ? isUserOnboardable(result.contents).isOnboardable
      : false;
  return (
    <OnboardableContext.Provider value={{ isOnboardable }}>
      {children}
    </OnboardableContext.Provider>
  );
};

const OnboardableWrapper: FC = ({ children }) => {
  const user = useCurrentUser();
  const [auth0] = useRecoilState(auth0State);
  if (user && !user.onboarded) {
    return auth0 ? (
      <LoadUserData id={user.id}>{children}</LoadUserData>
    ) : (
      <OnboardableContext.Provider value={{ isOnboardable: false }}>
        {children}
      </OnboardableContext.Provider>
    );
  }
  return (
    <OnboardableContext.Provider value={{ isOnboardable: null }}>
      {children}
    </OnboardableContext.Provider>
  );
};

export default OnboardableWrapper;
