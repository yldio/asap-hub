import { OnboardingPage } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';

import { useOnboarding } from '../hooks/onboarding';
import { usePatchUserById } from '../users/state';

const Onboarding: React.FC = ({ children }) => {
  const user = useCurrentUserGP2();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const onboardingState = useOnboarding(user!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(user!.id);

  /* istanbul ignore next */
  if (!onboardingState) {
    throw new Error('Failed to get onboarding state');
  }

  const publishUser = () =>
    patchUser({ onboarded: onboardingState?.isOnboardable });

  return (
    <OnboardingPage
      steps={onboardingState.steps}
      previousHref={onboardingState.previousStep}
      continueHref={onboardingState.nextStep}
      isContinueEnabled={onboardingState.isContinueEnabled}
      publishUser={publishUser}
    >
      {children}
    </OnboardingPage>
  );
};
export default Onboarding;
