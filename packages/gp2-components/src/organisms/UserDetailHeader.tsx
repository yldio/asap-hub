import { BackLink } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import UserDetailHeaderCard from './UserDetailHeaderCard';

type UserDetailHeaderProps = ComponentProps<typeof UserDetailHeaderCard> & {
  backHref?: string;
};

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  backHref,
  ...props
}) => (
  <header>
    {backHref && <BackLink href={backHref} />}
    <UserDetailHeaderCard {...props} />
  </header>
);
export default UserDetailHeader;
