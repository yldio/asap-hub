import { Frame } from '@asap-hub/frontend-utils';
import { UserResponse } from '@asap-hub/model';
import { BiographyModal, UserProfileAbout } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { networkRoutes } from '@asap-hub/routing';
import { Route, Routes } from 'react-router-dom';

import { usePatchUserById } from './state';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUserCRN() ?? {};

  const route = networkRoutes.DEFAULT.USERS.DETAILS.ABOUT;

  const patchUser = usePatchUserById(user.id);

  return (
    <Routes>
      <Route
        path={route.EDIT_BIOGRAPHY.path}
        element={
          <Frame title="Edit Biography">
            <>
              <UserProfileAbout
                {...user}
                editBiographyHref={
                  id === user.id
                    ? route.EDIT_BIOGRAPHY.buildPath({
                        id: user.id,
                      })
                    : undefined
                }
              />
              <BiographyModal
                biography={user.biography}
                backHref={route.path}
                onSave={(newBiography) =>
                  patchUser({
                    biography: newBiography,
                  })
                }
              />
            </>
          </Frame>
        }
      />
    </Routes>
  );
};

export default About;
