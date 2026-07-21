import { SerializedStyles } from '@emotion/react';
import { UserAward } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { Avatar } from '../atoms';
import AvatarWithBadge from './AvatarWithBadge';

type UserAvatarProps = {
  readonly imageUrl?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly latestAward?: UserAward;
  readonly avatarSize?: number;
  readonly badgeSize?: number;
  readonly overrideBadgeStyles?: SerializedStyles;
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  firstName,
  lastName,
  latestAward,
  avatarSize,
  badgeSize,
  overrideBadgeStyles,
}) => {
  const { isEnabled } = useFlags();

  return isEnabled('STAGING_MODE') && latestAward?.iconUrl ? (
    <AvatarWithBadge
      imageUrl={imageUrl}
      firstName={firstName}
      lastName={lastName}
      badgeUrl={latestAward.iconUrl}
      badgeAlt={latestAward.name}
      badgeSize={badgeSize}
      avatarSize={avatarSize}
      overrideBadgeStyles={overrideBadgeStyles}
    />
  ) : (
    <Avatar imageUrl={imageUrl} firstName={firstName} lastName={lastName} />
  );
};

export default UserAvatar;
