import { Frame } from '@asap-hub/frontend-utils';
import { UserResponse } from '@asap-hub/model';
import { BiographyModal, UserProfileAbout } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Route, Routes } from 'react-router-dom';

import { usePatchUserById } from './state';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUserCRN() ?? {};

  const route = network({}).users({}).user({ userId: user.id }).about({});

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <UserProfileAbout
        {...user}
        editBiographyHref={
          id === user.id ? route.editBiography({}).$ : undefined
        }
      />
      {id === user.id && (
        <Routes>
          <Route path={route.editBiography.template} element={
            <Frame title="Edit Biography">
              <BiographyModal
                biography={user.biography}
                backHref={route.$}
                onSave={(newBiography) =>
                  patchUser({
                    biography: newBiography,
                  })
                }
              />
            </Frame>
          } />
        </Routes>
      )}
    </>
  );
};

export default About;
