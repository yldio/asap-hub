import { OnboardingGroups } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';

import { useUserById } from '../users/state';

const Groups: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);

  if (userData) {
    return <OnboardingGroups {...userData} />;
  }
  return <NotFoundPage />;
};

export default Groups;
