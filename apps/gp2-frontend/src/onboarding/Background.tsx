import {
  OnboardingBackground,
  BiographyModal,
  TagsModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { Routes, Route } from 'react-router-dom';

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

  if (userData) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <OnboardingBackground
              {...userData}
              editBiographyHref={
                onboarding.DEFAULT.$.BACKGROUND.EDIT_BIOGRAPHY.relativePath
              }
              editTagsHref={
                onboarding.DEFAULT.$.BACKGROUND.EDIT_TAGS.relativePath
              }
            />
          }
        />
        <Route
          path={onboarding.DEFAULT.$.BACKGROUND.EDIT_BIOGRAPHY.relativePath}
          element={
            <BiographyModal
              {...userData}
              backHref={onboarding.DEFAULT.BACKGROUND.relativePath}
              onSave={(patchedUser) => patchUser(patchedUser)}
            />
          }
        />
        <Route
          path={onboarding.DEFAULT.$.BACKGROUND.EDIT_TAGS.relativePath}
          element={
            <TagsModal
              {...userData}
              backHref={onboarding.DEFAULT.BACKGROUND.relativePath}
              onSave={(patchedUser) => patchUser(patchedUser)}
              suggestions={allTags}
            />
          }
        />
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default Background;
