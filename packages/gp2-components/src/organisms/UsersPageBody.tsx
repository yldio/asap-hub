import { gp2 } from '@asap-hub/model';
import { drawerQuery, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import UserCard from './UserCard';

const { perRem } = pixels;
type UsersPageBodyProps = {
  users: gp2.ListUserResponse;
};
const gridContainerStyles = css({
  display: 'grid',
  gridGap: `${24 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  marginTop: `${48 / perRem}em`,

  [drawerQuery]: {
    gridTemplateColumns: '1fr',
  },
});

const UsersPageBody: React.FC<UsersPageBodyProps> = ({ users }) => (
  <article css={gridContainerStyles}>
    {users.items.map((user) => (
      <UserCard key={user.id} {...user} />
    ))}
  </article>
);

export default UsersPageBody;
