import React from 'react';

import { Paragraph, NetworkPeople } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from '../api';

const Page: React.FC<{}> = () => {
  const { loading, data: usersData, error } = useUsers();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (usersData) {
    const users = usersData.items.map((user: UserResponse) => ({
      ...user,
      href: join('/network/users', user.id),
      teams: user.teams.map((team) => ({
        ...team,
        href: `/network/teams/${team.id}`,
      })),
    }));
    return <NetworkPeople people={users} />;
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default Page;
