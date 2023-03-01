import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserDetailHeaderCard from './UserDetailHeaderCard';

type UserDetailHeaderProps = ComponentProps<typeof UserDetailHeaderCard>;

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ ...props }) => (
  <header css={css({ display: 'flex', flexDirection: 'column', gap: '32px' })}>
    <UserDetailHeaderCard {...props} />
  </header>
);
export default UserDetailHeader;
