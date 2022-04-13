import { useRouteMatch, Route } from 'react-router-dom';
import { UserProfileAbout, BiographyModal } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Frame } from '@asap-hub/structure';
import { usePatchUserById } from './state';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUser() ?? {};

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
