import { Frame } from '@asap-hub/frontend-utils';
import { UserResponse } from '@asap-hub/model';
import { BiographyModal, UserProfileAbout } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Route, useRouteMatch } from 'react-router-dom';

import { usePatchUserById } from './state';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUserCRN() ?? {};

  const { path } = useRouteMatch();
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
      <Route exact path={path + route.editBiography.template}>
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
      </Route>
    </>
  );
};

export default About;
