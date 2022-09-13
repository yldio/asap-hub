//import { gp2 } from '@asap-hub/model';
import { pixels, drawerQuery } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserCard from './UserCard';

//import UserCard from './UserCard';

const { perRem } = pixels;
type UsersPageBodyProps = {
  users: ComponentProps<typeof UserCard>[];
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
    {users.map((user) => (
      //<p>Working...</p>
      <UserCard key={user.id} {...user} />
    ))}
  </article>
);

export default UsersPageBody;
