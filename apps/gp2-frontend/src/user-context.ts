import { createContext, useContext } from 'react';

type User = {
  showWelcomeBackBanner: boolean;
  dismissBanner: () => void;
};

export const UserContext = createContext<User>({
  showWelcomeBackBanner: false,
  dismissBanner: (): never => {
    throw new Error('dismiss banner function not provided');
  },
});

export const useUserContext = (): User => useContext(UserContext);
