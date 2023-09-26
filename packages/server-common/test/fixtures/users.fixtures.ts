import { UserDataObject } from '@asap-hub/model';

export const getUserDataObject = (): UserDataObject => ({
  id: 'userId',
  firstName: 'Tony',
  lastName: 'Stark',
  email: 'tony@.stark.com',
  connections: [],
  createdDate: '2020-09-25T09:42:51.000Z',
  expertiseAndResourceTags: [],
  labs: [],
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  questions: [],
  role: 'Grantee',
  teams: [
    {
      displayName: 'Unknown',
      id: 'team-id-1',
      role: 'Lead PI (Core Leadership)',
      inactiveSinceDate: '',
    },
    {
      displayName: 'Unknown',
      id: 'team-id-3',
      role: 'Collaborating PI',
      inactiveSinceDate: '2022-09-25T09:42:51.000Z',
    },
  ],
  workingGroups: [],
  interestGroups: [],
});
