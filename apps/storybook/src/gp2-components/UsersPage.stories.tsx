import { Layout, UsersPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates /UsersPage / UsersPage',
  component: UsersPage,
  decorators: [NoPaddingDecorator],
};

const items: gp2.UserResponse[] = [
  {
    createdDate: '2020-03-03',
    email: 'pmars@email.com',
    firstName: 'Phillip',
    displayName: 'Phillip Mars',
    id: 'u42',
    lastName: 'Mars',
    region: 'Europe' as const,
    role: 'Network Collaborator' as const,
  },
];

const users: gp2.ListUserResponse = {
  items,
  total: 1,
};
export const Normal = () => (
  <Layout>
    <UsersPage users={users}></UsersPage>
  </Layout>
);
