import { gp2 } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import UserCard from './UserCard';

const { rem } = pixels;
type UsersPageBodyProps = {
  users: gp2.ListUserResponse;
};

const gridContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(24),
  marginTop: rem(48),
});

const UsersPageBody: React.FC<UsersPageBodyProps> = ({ users }) => (
  <article css={gridContainerStyles}>
    {users.items.map((user) => (
      <UserCard key={user.id} {...user} />
    ))}
  </article>
);

export default UsersPageBody;
