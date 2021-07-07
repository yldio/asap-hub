import { createContext, useContext } from 'react';

type User = {
  onboardable: boolean;
  updateOnboardable: (value: boolean) => void;
};

// {
//   "id": "2a854c5a-184f-40ff-9615-bc6ca72b6470",
//   "onboarded": true,
//   "displayName": "Thomas Waterfall",
//   "email": "tom.waterfall@yld.io",
//   "firstName": "Thomas",
//   "lastName": "Waterfall",
//   "avatarUrl": "https://cloud.squidex.io/api/assets/asap-hub-dev/c26c1cf1-9afb-40d4-9fe1-344f4bb8fa1e",
//   "teams": [
//     {
//       "id": "055038ee-8bed-4439-9985-69a1fbc9de9b",
//       "displayName": "Rio '",
//       "role": "Lead PI (Core Leadership)"
//     }
//   ]
// }

export const UserContext = createContext<User>({
  onboardable: false,
  updateOnboardable: (value: boolean) => {},
});

export const UserContextProvider = UserContext.Provider;

export const useUserContext = (): User => useContext(UserContext);
