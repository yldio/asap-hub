import React from 'react';
import { join } from 'path';
import { useRouteMatch, Route, useHistory } from 'react-router-dom';
import { ProfileAbout, BiographyModal } from '@asap-hub/react-components';
import { UserResponse, UserPatchRequest } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { useUserById } from '../../api';

type AboutProps = {
  userProfile: UserResponse;
};
const About: React.FC<AboutProps> = ({ userProfile }) => {
  const { id } = useCurrentUser() ?? {};

  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { patch } = useUserById(userProfile.id);

  return (
    <>
      <ProfileAbout
        {...userProfile}
        editBiographyHref={
          id === userProfile.id ? join(url, 'edit-biography') : undefined
        }
        editOrcidWorksHref={
          id === userProfile.id ? join(url, 'edit-works') : undefined
        }
      />
      <Route exact path={`${path}/edit-biography`}>
        <BiographyModal
          biography={userProfile.biography}
          backHref={url}
          onSave={async (newBiography) => {
            await patch({ biography: newBiography } as UserPatchRequest);
            history.push(url);
          }}
        />
      </Route>
    </>
  );
};

export default About;
