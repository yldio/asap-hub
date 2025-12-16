import { css } from '@emotion/react';

import { Anchor, Card, Ellipsis, Link, Pill } from '../atoms';
import { fern } from '../colors';
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
  color: fern.rgb,
  display: 'flex',
});

const plainTextStyles = css({
  color: 'rgb(77, 100, 107)',
});

const tagsContainerStyles = css({
  margin: `${rem(8)} 0`,
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: rem(8),
});

const pillsStyles = css({
  display: 'flex',
  gap: rem(8),
  height: '3rem',
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
  readonly teamType?: string;
  readonly researchTheme?: string;
  readonly resourceType?: string;
  readonly textIcon?: React.ReactNode;
  readonly textHref?: string;
  readonly isTeamCard?: boolean;
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
  teamType,
  researchTheme,
  resourceType,
  textIcon,
  textHref,
  isTeamCard,
}) => (
  <Card accent={active ? 'default' : 'neutral200'}>
    {(teamType || researchTheme || resourceType) && (
      <div css={pillsStyles}>
        {teamType && <Pill noMargin>{teamType}</Pill>}
        {researchTheme && <Pill>{researchTheme}</Pill>}
        {resourceType && <Pill>{resourceType}</Pill>}
      </div>
    )}
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
      {!!text && (
        <div css={textStyles}>
          {textIcon && <span css={iconStyles}>{textIcon}</span>}
          {(() => {
            const ellipsisContent = (
              <Ellipsis numberOfLines={2}>{text}</Ellipsis>
            );

            if (isTeamCard) {
              return textHref ? (
                <Anchor href={textHref}>{ellipsisContent}</Anchor>
              ) : (
                <span css={plainTextStyles}>{ellipsisContent}</span>
              );
            }

            return href ? (
              <Anchor href={href}>{ellipsisContent}</Anchor>
            ) : (
              <span css={plainTextStyles}>{ellipsisContent}</span>
            );
          })()}
        </div>
      )}
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
