import React from 'react';

import { Paragraph, NetworkPeople } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from '../api';

interface ProfileListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const ProfileList: React.FC<ProfileListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const result = useUsers({
    searchQuery,
    filters: [...filters],
  });

  if (result.loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  const users = result.data.items.map((user: UserResponse) => ({
    ...user,
    href: join('/network/users', user.id),
    teams: user.teams.map((team) => ({
      ...team,
      href: `/network/teams/${team.id}`,
    })),
  }));
  return (
    <NetworkPeople
      people={users}
      numberOfItems={users.length}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    />
  );
};

export default ProfileList;
