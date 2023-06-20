import { OnboardingPage } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';

import { useOnboarding } from '../hooks/onboarding';

const Onboarding: React.FC = ({ children }) => {
  const user = useCurrentUserGP2();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const onboardingState = useOnboarding(user!.id);

  /* istanbul ignore next */
  if (!onboardingState) {
    throw new Error('Failed to get onboarding state');
  }

  return (
    <OnboardingPage
      steps={onboardingState.steps}
      previousHref={onboardingState.previousStep}
      continueHref={onboardingState.nextStep}
      isContinueEnabled={onboardingState?.isContinueEnabled || false}
      publishHref={gp2.onboarding({}).preview({}).publish({}).$}
    >
      {children}
    </OnboardingPage>
  );
};
export default Onboarding;
