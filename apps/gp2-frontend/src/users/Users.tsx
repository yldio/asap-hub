import { UsersPage } from '@asap-hub/gp2-components';
import { FC, useEffect, useState } from 'react';
import { gp2 } from '@asap-hub/model';

const getUsers = (): gp2.ListUserResponse => {
  const items = [
    {
      createdDate: '2020/03/03',
      email: 'pmars@email.com',
      firstName: 'Phillip',
      displayName: 'Phillip Mars',
      id: 'u42',
      lastName: 'Mars',
      region: 'Australasia',
      role: 'Network Collaborator' as const,
    },
  ];
  return {
    items,
    total: 1,
  };
};

const Users: FC = () => {
  const [users, setUser] = useState(getUsers());
  useEffect(() => {
    setUser(getUsers());
  }, []);
  return <UsersPage users={users} />;
};

export default Users;
