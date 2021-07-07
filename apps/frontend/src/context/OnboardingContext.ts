import { createContext } from 'react';

export interface IOrboardingProps {
  onboardable: boolean;
}

const OnboardingContext = createContext<IOrboardingProps>({
  onboardable: false,
});

export const OnboardingContextConsumer = OnboardingContext.Consumer;
export const OnboardingContextProvider = OnboardingContext.Provider;

export default OnboardingContext;
