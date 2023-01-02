import { gp2 as gp2Validation } from '@asap-hub/validation';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useLocation } from 'react-router-dom';
import { useUserById } from '../users/state';

const { isUserOnboardable } = gp2Validation;

const orderedSteps = [
  'Core Details',
  'Background',
  'GP2 Groups',
  'Additional Details',
  'Preview',
] as const;

const stepToHref: Record<typeof orderedSteps[number], string> = {
  'Core Details': gp2Routing.onboarding({}).coreDetails({}).$,
  Background: gp2Routing.onboarding({}).background({}).$,
  'GP2 Groups': gp2Routing.onboarding({}).groups({}).$,
  'Additional Details': gp2Routing.onboarding({}).additionalDetails({}).$,
  Preview: gp2Routing.onboarding({}).preview({}).$,
};

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

export const useOnboarding = (id: string) => {
  const user = useUserById(id);
  const { pathname } = useLocation();
  if (!user) {
    return undefined;
  }
  const { isOnboardable, ...onBoardingValidation } = isUserOnboardable(user);
  const incompleteSteps = orderedSteps.reduce<string[]>((acc, stepKey) => {
    const fieldsToCheck = Object.entries(fieldToStep)
      .filter(([, step]) => step === stepKey)
      .map(([field]) => field);
    return fieldsToCheck.some((field) =>
      Object.keys(onBoardingValidation).includes(field),
    )
      ? [...acc, stepKey]
      : acc;
  }, []);
  const steps = orderedSteps.map((step, index) => ({
    name: step,
    href: stepToHref[step],
    disabled:
      index >
      orderedSteps.findIndex(
        (orderedStep) => stepToHref[orderedStep] === pathname,
      ),
    completed: !incompleteSteps.some(
      (incompleteStep) => incompleteStep === step,
    ),
  }));
  const currentStepIndex = steps.findIndex((step) =>
    pathname.includes(step.href),
  );
  const previousStep =
    currentStepIndex > 0 ? steps[currentStepIndex - 1].href : undefined;
  const nextStep =
    currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1].href
      : undefined;

  return {
    isOnboardable,
    steps,
    previousStep,
    nextStep,
    isContinueEnabled: steps[currentStepIndex].completed,
  };
};
