import React, { useContext } from 'react';

type UserProfile = {
  isOwnProfile: boolean;
};

export const UserProfileContext = React.createContext<UserProfile>({
  isOwnProfile: false,
});
export const useUserProfileContext = (): UserProfile =>
  useContext(UserProfileContext);
