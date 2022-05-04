import { createContext, useContext } from 'react';

type UserProfile = {
  isOwnProfile: boolean;
};

export const UserProfileContext = createContext<UserProfile>({
  isOwnProfile: false,
});

export const useUserProfileContext = (): UserProfile =>
  useContext(UserProfileContext);
