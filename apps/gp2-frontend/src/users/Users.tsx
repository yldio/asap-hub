import { UsersPage } from '@asap-hub/gp2-components';
import { FC, useEffect, useState } from 'react';

const getUsers = () => {
  const result = [
    {
      id: 'u42',
      displayName: 'Phillip Mars',
      degree: ['PhD'],
      firstName: 'Phillip',
      lastName: 'Mars',
      avatarUrl: '',
      role: 'GP2 Admin',
      region: 'Australasia',
      workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
      projects: [{ id: 0, name: 'Genetic determinants of progression in PD' }],
      tags: [
        'Neurological Diseases',
        'Clinical Neurology',
        'Adult Neurology',
        'Neuroimaging',
        'Neurologic Examination',
        'Neuroprotection',
        'Movement Disorders',
        'Neurodegenerative Diseases',
        'Neurological Diseases',
      ],
    },
    {
      id: 'u43',
      displayName: 'Phil Mars',
      degree: ['PhD'],
      firstName: 'Phillip',
      lastName: 'Mars',
      avatarUrl: '',
      role: 'GP2 Admin',
      region: 'Australasia',
      workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
      projects: [{ id: 0, name: 'Genetic determinants of progression in PD' }],
      tags: [
        'Neurological Diseases',
        'Clinical Neurology',
        'Adult Neurology',
        'Neuroimaging',
        'Neurologic Examination',
        'Neuroprotection',
        'Movement Disorders',
        'Neurodegenerative Diseases',
        'Neurological Diseases',
      ],
    },
  ];
  return result;
};

const Users: FC<Record<string, never>> = () => {
  const [users, setUser] = useState(getUsers());
  useEffect(() => {
    setUser(getUsers());
  }, []);
  return <UsersPage users={users} />;
};

export default Users;
