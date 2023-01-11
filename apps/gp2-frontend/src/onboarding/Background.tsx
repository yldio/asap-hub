import { OnboardingBackground } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';

import { useUserById } from '../users/state';

const Background: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  if (userData) {
    return (
      <>
        <OnboardingBackground
          {...userData}
          editBiographyHref={onboarding({}).background({}).editBiography({}).$}
          editKeywordsHref={onboarding({}).background({}).editKeywords({}).$}
        />
        <Route path={onboarding({}).background({}).editBiography({}).$}>
          {/* { edit Biography Modal} */}
        </Route>
        <Route path={onboarding({}).background({}).editKeywords({}).$}>
          {/* { edit Keywords Modal} */}
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Background;
