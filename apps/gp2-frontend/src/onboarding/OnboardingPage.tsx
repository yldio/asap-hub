import {
  OnboardingPageHeader,
  OnboardingPageFooter,
} from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useLocation } from 'react-router-dom';
import { useOnboarding } from '../hooks/onboarding';
import { usePatchUserById } from '../users/state';

const orderedSteps = [
  {
    href: gp2Routing.onboarding({}).coreDetails({}).$,
    name: 'Core Details',
  },
  {
    href: gp2Routing.onboarding({}).background({}).$,
    name: 'Background',
  },
  {
    href: gp2Routing.onboarding({}).groups({}).$,
    name: 'GP2 Groups',
  },
  {
    href: gp2Routing.onboarding({}).additionalDetails({}).$,
    name: 'Additional Details',
  },
  {
    href: gp2Routing.onboarding({}).preview({}).$,
    name: 'Preview',
  },
];

const OnboardingPage: React.FC = ({ children }) => {
  const { pathname } = useLocation();
  const user = useCurrentUserGP2();
  const onboardingState = useOnboarding(user!.id);
  const patchUser = usePatchUserById(user!.id);

  const steps = orderedSteps.map((step, index) => ({
    ...step,
    disabled: index > orderedSteps.findIndex(({ href }) => href === pathname),
    // validation is going to be done with the complete flag
    completed:
      !!onboardingState &&
      onboardingState.incompleteSteps.filter(
        (incompleteStep) => incompleteStep === step.name,
      ).length === 0,
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

  const publishUser = () => patchUser({ onboarded: true });

  return (
    <article>
      <OnboardingPageHeader steps={steps} />
      <main>{children}</main>
      <OnboardingPageFooter
        previousHref={previousStep}
        continueHref={nextStep}
        continueEnabled={steps[currentStepIndex].completed}
        publishUser={publishUser}
      />
    </article>
  );
};
export default OnboardingPage;
