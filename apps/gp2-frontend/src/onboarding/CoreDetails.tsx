import { OnboardingCoreDetails } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { useUserById } from '../users/state';

const CoreDetails: React.FC<Record<string, never>> = () => {
  // const backHref = useBackHref() ?? projects({}).$;
  const currentUser = useCurrentUserGP2();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  if (userData) {
    return <OnboardingCoreDetails {...userData} />;
  }
  return <NotFoundPage />;
};

export default CoreDetails;
