import React from 'react';
import { join } from 'path';
import { useRouteMatch, Route, useHistory } from 'react-router-dom';
import { UserProfileAbout, BiographyModal } from '@asap-hub/react-components';
import { UserResponse, UserPatchRequest } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';

type AboutProps = {
  userProfile: UserResponse;
  onPatchUserProfile: (patch: UserPatchRequest) => void | Promise<void>;
};
const About: React.FC<AboutProps> = ({ userProfile, onPatchUserProfile }) => {
  const { id } = useCurrentUser() ?? {};

  const { path, url } = useRouteMatch();
  const history = useHistory();

  return (
    <>
      <UserProfileAbout
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
            await onPatchUserProfile({
              biography: newBiography,
            });
            history.push(url);
          }}
        />
      </Route>
    </>
  );
};

export default About;
