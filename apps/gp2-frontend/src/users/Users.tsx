import { UsersPage } from '@asap-hub/gp2-components';
import { useUsersState } from './state';

const Users: React.FC<Record<string, never>> = () => {
  const users = useUsersState();
  return <UsersPage users={users} />;
};
export default Users;
