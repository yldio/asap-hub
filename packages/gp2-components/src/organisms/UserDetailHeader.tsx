import { gp2 as gp2Model } from '@asap-hub/model';

type UserDetailHeaderProps = Pick<
  gp2Model.UserResponse,
  'displayName' | 'avatarUrl' | 'degrees'
> & {
  backHref: string;
};

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  displayName,
  avatarUrl,
  degrees,
  backHref,
}) => (
  <header>
    <p>{displayName}</p>
  </header>
);
export default UserDetailHeader;
