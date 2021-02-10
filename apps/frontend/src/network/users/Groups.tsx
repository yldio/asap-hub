import React from 'react';
import { UserProfileGroups } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { join } from 'path';

import { useUserGroupsById } from './state';
import { NETWORK_PATH } from '../../routes';
import { GROUPS_PATH } from '../routes';

const UserGroups: React.FC<{ user: UserResponse }> = ({ user }) => {
  const groups = useUserGroupsById(user.id);

  return groups.total ? (
    <UserProfileGroups
      {...user}
      groups={groups.items.map((group) => ({
        ...group,
        href: join('/', NETWORK_PATH, GROUPS_PATH, group.id),
      }))}
    />
  ) : null;
};

export default UserGroups;
