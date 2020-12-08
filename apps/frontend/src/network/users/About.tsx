import React from 'react';
import { join } from 'path';
import { useRouteMatch, Route } from 'react-router-dom';
import { UserProfileAbout, BiographyModal } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { usePatchUserById } from './state';
import { usePushFromHere } from '../../history';

type AboutProps = {
  user: UserResponse;
};
const About: React.FC<AboutProps> = ({ user }) => {
  const { id } = useCurrentUser() ?? {};

  const { path, url } = useRouteMatch();
  const historyPush = usePushFromHere();

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <UserProfileAbout
        {...user}
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
          onSave={async (newBiography) => {
            await patchUser({
              biography: newBiography,
            });
            historyPush(url);
          }}
        />
      </Route>
    </>
  );
};

export default About;
