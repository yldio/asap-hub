import { Frame } from '@asap-hub/frontend-utils';
import { UsersPage } from '@asap-hub/gp2-components';
import UserList from './UserList';

const Users: React.FC<Record<string, never>> = () => (
  <UsersPage>
    <Frame title="Users">
      <UserList />
    </Frame>
  </UsersPage>
);
export default Users;
