import React from 'react';
import { UserProfileGroups } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

import { useUserGroupsById } from './state';

const UserGroups: React.FC<{ user: UserResponse }> = ({ user }) => {
  const groups = useUserGroupsById(user.id);

  return groups.total ? (
    <UserProfileGroups {...user} groups={groups.items} />
  ) : null;
};

export default UserGroups;
