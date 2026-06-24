import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { Anchor, Avatar } from '../atoms';
import { rem } from '../pixels';

const containerStyles = css({
  position: 'relative',
  display: 'inline-flex',
});

const badgeSlotStyles = (size: number) =>
  css({
    position: 'absolute',
    right: 0,
    bottom: 0,
    display: 'inline-flex',
    width: rem(size),
    height: rem(size),
  });

const badgeImageStyles = css({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
});

type AvatarWithBadgeProps = ComponentProps<typeof Avatar> & {
  readonly badgeUrl: string;
  readonly badgeAlt: string;
  readonly badgeHref?: string;
  readonly badgeSize?: number;
};

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  badgeUrl,
  badgeAlt,
  badgeHref,
  badgeSize = 28,
  ...avatarProps
}) => {
  const badgeImage = (
    <img css={badgeImageStyles} src={badgeUrl} alt={badgeAlt} />
  );

  return (
    <span css={containerStyles}>
      <Avatar {...avatarProps} />
      <span css={badgeSlotStyles(badgeSize)}>
        {badgeHref ? (
          <Anchor href={badgeHref} aria-label={badgeAlt}>
            {badgeImage}
          </Anchor>
        ) : (
          badgeImage
        )}
      </span>
    </span>
  );
};

export default AvatarWithBadge;
