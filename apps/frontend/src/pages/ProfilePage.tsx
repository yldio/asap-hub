import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ProfilePage } from '@asap-hub/react-components';

interface ProfilePageParams {
  id: string;
}

const Profile: React.FC<RouteComponentProps<ProfilePageParams>> = ({
  match,
}) => {
  return <ProfilePage />;
};

export default Profile;
