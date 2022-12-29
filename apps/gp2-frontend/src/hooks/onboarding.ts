import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import { useUserById } from '../users/state';

const { isUserOnboardable } = gp2Validation;

const orderedSteps = [
  'Core Details',
  'Background',
  'GP2 Groups',
  'Additional Details',
  'Preview',
] as const;

const fieldToStep: Record<
  keyof Omit<ReturnType<typeof isUserOnboardable>, 'isOnboardable'>,
  typeof orderedSteps[number]
> = {
  firstName: 'Core Details',
  lastName: 'Core Details',
  degrees: 'Core Details',
  region: 'Core Details',
  country: 'Core Details',
  positions: 'Core Details',
  biography: 'Background',
  keywords: 'Background',
};

export const onboardingPages = {
  'Core Details': {
    href: gp2Routing.onboarding({}).coreDetails({}).$,
    name: 'Core Details',
  },
  Background: {
    href: gp2Routing.onboarding({}).background({}).$,
    name: 'Background',
  },
  'GP2 Groups': {
    href: gp2Routing.onboarding({}).groups({}).$,
    name: 'GP2 Groups',
  },
  'Aditional Details': {
    href: gp2Routing.onboarding({}).additionalDetails({}).$,
    name: 'Additional Details',
  },
  Preview: {
    href: gp2Routing.onboarding({}).preview({}).$,
    name: 'Preview',
  },
};

export const useOnboarding = (id: string) => {
  const user = useUserById(id);
  if (!user) {
    return undefined;
  }
  const { isOnboardable, ...onBoardingValidation } = isUserOnboardable(user);
  return {
    isOnboardable,
    incompleteSteps: orderedSteps.reduce<string[]>((acc, stepKey) => {
      const fieldsToCheck = Object.entries(fieldToStep)
        .filter(([, step]) => step === stepKey)
        .map(([field]) => field);
      return fieldsToCheck.some((field) =>
        Object.keys(onBoardingValidation).includes(field),
      )
        ? [...acc, stepKey]
        : acc;
    }, []),
  };
};
