import { createContext, useContext } from 'react';

type Onboardable = {
  isOnboardable: boolean | null;
};

export const OnboardableContext = createContext<Onboardable>({
  isOnboardable: null,
});

export const useOnboardableContext = (): Onboardable =>
  useContext(OnboardableContext);

export default OnboardableContext;
