import { css } from '@emotion/react';

import { Anchor, Card, Ellipsis, Link } from '../atoms';
import { lead } from '../colors';
import { googleDriveIcon } from '../icons';
import { LinkHeadline, TagList } from '../molecules';
import { mobileScreen, rem } from '../pixels';

const contentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const titleStyle = css({
  display: 'flex',
  flexFlow: 'column',
  gap: rem(12),
  alignItems: 'flex-start',

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    gap: rem(16),
    alignItems: 'center',
  },
});

const googleDriveButtonStyle = css({
  '> a': {
    backgroundColor: 'transparent',
  },
});

const textStyles = css({
  color: lead.rgb,
});

const tagsContainerStyles = css({
  margin: `${rem(8)} 0`,
});

type CardWrapperProps = {
  readonly active?: boolean;
  readonly footer: React.ReactNode;
  readonly googleDrive?: string;
  readonly href: string;
  readonly inactiveBadge: React.ReactNode;
  readonly tags: string[];
  readonly text: string;
  readonly title: string;
};

const EntityCard: React.FC<CardWrapperProps> = ({
  active = true,
  footer,
  googleDrive,
  href,
  inactiveBadge,
  tags,
  text,
  title,
}) => (
  <Card accent={active ? 'default' : 'neutral200'}>
    <div css={contentStyles}>
      <div css={titleStyle}>
        <LinkHeadline level={2} styleAsHeading={4} href={href} noMargin>
          {title}
        </LinkHeadline>
        {!active && inactiveBadge}
      </div>
      {googleDrive && (
        <span css={googleDriveButtonStyle}>
          <Link href={googleDrive} buttonStyle small noMargin>
            {googleDriveIcon} Access Drive
          </Link>
        </span>
      )}
      <Anchor href={href} css={textStyles}>
        <Ellipsis numberOfLines={2}>{text}</Ellipsis>
      </Anchor>
      {!!tags.length && (
        <div css={tagsContainerStyles}>
          <TagList max={3} tags={tags} />
        </div>
      )}

      {footer}
    </div>
  </Card>
);

export default EntityCard;
