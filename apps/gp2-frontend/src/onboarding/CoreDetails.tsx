import {
  OnboardingCoreDetails,
  KeyInformationModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';
import { usePatchUserById, useUserById } from '../users/state';

const CoreDetails: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);

  const patchUser = usePatchUserById(currentUser!.id);

  if (userData) {
    return (
      <>
        <OnboardingCoreDetails {...userData} />
        <Route path={onboarding({}).coreDetails({}).editKeyInfo({}).$}>
          <KeyInformationModal
            {...userData}
            backHref={onboarding({}).coreDetails({}).$}
            onSave={({ firstName, lastName }) =>
              patchUser({ firstName, lastName })
            }
          />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default CoreDetails;
