import {
  OnboardingBackground,
  BiographyModal,
  TagsModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Route, Routes } from 'react-router-dom';

import { usePatchUserById, useUserById } from '../users/state';
import { useTags } from '../shared/state';

const Background: React.FC<Record<string, never>> = () => {
  const currentUser = useCurrentUserGP2();
  const { onboarding } = gp2;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userData = useUserById(currentUser!.id);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const patchUser = usePatchUserById(currentUser!.id);

  const { items: allTags } = useTags();

  const backgroundRoute = onboarding({}).background({});

  if (userData) {
    return (
      <>
        <OnboardingBackground
          {...userData}
          editBiographyHref={backgroundRoute.editBiography({}).$}
          editTagsHref={backgroundRoute.editTags({}).$}
        />
        <Routes>
          <Route
            path="edit-biography"
            element={
              <BiographyModal
                {...userData}
                backHref={backgroundRoute.$}
                onSave={(patchedUser) => patchUser(patchedUser)}
              />
            }
          />
          <Route
            path="edit-tags"
            element={
              <TagsModal
                {...userData}
                backHref={backgroundRoute.$}
                onSave={(patchedUser) => patchUser(patchedUser)}
                suggestions={allTags}
              />
            }
          />
        </Routes>
      </>
    );
  }
  return <NotFoundPage />;
};

export default Background;
