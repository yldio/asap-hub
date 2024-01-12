import {
  OnboardingBackground,
  BiographyModal,
  TagsModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';

import { usePatchUserById, useUserById } from '../users/state';
import { useTags } from '../shared/state';

const Background: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;

  const userData = useUserById(currentUser!.id);

  const patchUser = usePatchUserById(currentUser!.id);

  const { items: allTags } = useTags();

  if (userData) {
    return (
      <>
        <OnboardingBackground
          {...userData}
          editBiographyHref={onboarding({}).background({}).editBiography({}).$}
          editTagsHref={onboarding({}).background({}).editTags({}).$}
        />
        <Route path={onboarding({}).background({}).editBiography({}).$}>
          <BiographyModal
            {...userData}
            backHref={onboarding({}).background({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
          />
        </Route>
        <Route path={onboarding({}).background({}).editTags({}).$}>
          <TagsModal
            {...userData}
            backHref={onboarding({}).background({}).$}
            onSave={(patchedUser) => patchUser(patchedUser)}
            suggestions={allTags}
          />
        </Route>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Background;
