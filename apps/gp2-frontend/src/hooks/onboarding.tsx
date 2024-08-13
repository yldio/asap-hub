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

export const stepToHref: Record<(typeof orderedSteps)[number], string> = {
  'Core Details': gp2Routing.onboarding.DEFAULT.CORE_DETAILS.relativePath,
  Background: gp2Routing.onboarding.DEFAULT.BACKGROUND.relativePath,
  'GP2 Groups': gp2Routing.onboarding.DEFAULT.GROUPS.relativePath,
  'Additional Details':
    gp2Routing.onboarding.DEFAULT.ADDITIONAL_DETAILS.relativePath,
  Preview: gp2Routing.onboarding.DEFAULT.PREVIEW.relativePath,
};

const fieldToStep: Record<
  keyof Omit<ReturnType<typeof isUserOnboardable>, 'isOnboardable'>,
  (typeof orderedSteps)[number]
> = {
  firstName: 'Core Details',
  lastName: 'Core Details',
  degrees: 'Core Details',
  region: 'Core Details',
  country: 'Core Details',
  positions: 'Core Details',
  biography: 'Background',
  tags: 'Background',
};

export const useOnboarding = (id: string) => {
  const user = useUserById(id);
  const { pathname } = useLocation();
  if (!user) {
    return undefined;
  }
  const { isOnboardable, ...onBoardingValidation } = isUserOnboardable(user);

  const steps = orderedSteps.map((step, index) => ({
    name: step,
    href: stepToHref[step],
    disabled:
      index >
      orderedSteps.findIndex(
        (orderedStep) => stepToHref[orderedStep] === pathname,
      ),
    completed: !Object.keys(onBoardingValidation).some(
      (incompleteField) =>
        fieldToStep[
          incompleteField as keyof Omit<
            ReturnType<typeof isUserOnboardable>,
            'isOnboardable'
          >
        ] === step,
    ),
  }));
  const currentStepIndex = steps.findIndex((step) =>
    pathname.includes(step.href),
  );
  const previousStep =
    currentStepIndex > 0 ? steps[currentStepIndex - 1]?.href : undefined;
  const nextStep =
    currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1]?.href
      : undefined;
  return {
    isOnboardable,
    steps,
    previousStep,
    nextStep,
    isContinueEnabled: steps[currentStepIndex]?.completed,
  };
};
