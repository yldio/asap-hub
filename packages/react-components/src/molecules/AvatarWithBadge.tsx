import { ComponentProps } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { Avatar } from '../atoms';
import { rem } from '../pixels';

const containerStyles = (avatarSize: number) =>
  css({
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
  readonly avatarSize?: number;
  readonly overrideBadgeStyles?: SerializedStyles;
};

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  badgeUrl,
  badgeAlt,
  badgeSize = 28,
  avatarSize = 90,
  overrideBadgeStyles,
  ...avatarProps
}) => (
  <span css={containerStyles(avatarSize)}>
    <Avatar {...avatarProps} />
    <span css={[badgeSlotStyles(badgeSize), overrideBadgeStyles]}>
      <img css={badgeImageStyles} src={badgeUrl} alt={badgeAlt} />
    </span>
  </span>
);

export default AvatarWithBadge;
