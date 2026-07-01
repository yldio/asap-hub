import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../atoms';
import { rem } from '../pixels';

const avatarSize = 90;

const containerStyles = css({
  position: 'relative',
  display: 'flex',
  alignSelf: 'start',
  width: rem(avatarSize),
  height: rem(avatarSize),
});

const badgeSlotStyles = (size: number) =>
  css({
    position: 'absolute',
    right: rem(-6),
    bottom: rem(-16),
    display: 'inline-flex',
    width: rem(size),
    height: rem(size),
  });

// shared with the profile-header badge overlay so the circular crop can't drift
export const badgeImageStyles = css({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
});

type AvatarWithBadgeProps = ComponentProps<typeof Avatar> & {
  readonly badgeUrl: string;
  readonly badgeAlt: string;
  readonly badgeSize?: number;
};

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  badgeUrl,
  badgeAlt,
  badgeSize = 28,
  ...avatarProps
}) => (
  <span css={containerStyles}>
    <Avatar {...avatarProps} />
    <span css={badgeSlotStyles(badgeSize)}>
      <img css={badgeImageStyles} src={badgeUrl} alt={badgeAlt} />
    </span>
  </span>
);

export default AvatarWithBadge;
