import React from 'react';
import { join } from 'path';
import { useRouteMatch } from 'react-router-dom';
import { ProfileAbout } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';

type AboutProps = {
  userProfile: UserResponse;
};
const About: React.FC<AboutProps> = ({ userProfile }) => {
  const { id } = useCurrentUser() ?? {};
  const { url } = useRouteMatch();
  return (
    <ProfileAbout
      {...userProfile}
      editBiographyHref={
        id === userProfile.id ? join(url, 'edit-biography') : undefined
      }
      editOrcidWorksHref={
        id === userProfile.id ? join(url, 'edit-biography') : undefined
      }
    />
  );
};

export default About;
