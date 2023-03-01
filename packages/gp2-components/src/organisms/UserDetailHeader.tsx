import { ComponentProps } from 'react';
import { detailHeaderStyles } from '../layout';
import UserDetailHeaderCard from './UserDetailHeaderCard';

type UserDetailHeaderProps = ComponentProps<typeof UserDetailHeaderCard>;

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ ...props }) => (
  <header css={detailHeaderStyles}>
    <UserDetailHeaderCard {...props} />
  </header>
);
export default UserDetailHeader;
