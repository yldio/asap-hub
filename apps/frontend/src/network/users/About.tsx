import React from 'react';
import { join } from 'path';
import { useRouteMatch, Route } from 'react-router-dom';
import { UserProfileAbout, BiographyModal } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { isEnabled } from '@asap-hub/flags';

import { usePatchUserById } from './state';
import Frame from '../../structure/Frame';
import UserGroups from './Groups';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUser() ?? {};

  const { path, url } = useRouteMatch();

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <UserProfileAbout
        {...user}
        userProfileGroupsCard={
          isEnabled('GROUPS') ? (
            <Frame fallback={null}>
              <UserGroups user={user} />
            </Frame>
          ) : undefined
        }
        editBiographyHref={
          id === user.id ? join(url, 'edit-biography') : undefined
        }
        editOrcidWorksHref={
          id === user.id ? join(url, 'edit-works') : undefined
        }
      />
      <Route exact path={`${path}/edit-biography`}>
        <BiographyModal
          biography={user.biography}
          backHref={url}
          onSave={(newBiography) =>
            patchUser({
              biography: newBiography,
            })
          }
        />
      </Route>
    </>
  );
};

export default About;
