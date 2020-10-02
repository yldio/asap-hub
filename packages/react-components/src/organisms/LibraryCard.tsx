import React from 'react';
import css from '@emotion/css';
import format from 'date-fns/format';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Card, Link, Headline2, Caption, TagLabel, Paragraph } from '../atoms';
import { tabletScreen, perRem } from '../pixels';
import { lead } from '../colors';
import { teamIcon } from '../icons';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const textStyles = css({
  flexBasis: '100%',
});

const moveStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexBasis: 'auto',
    order: 1,
  },
});

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

type LibraryCardProps = Pick<
  ResearchOutputResponse,
  'publishDate' | 'title' | 'type' | 'created' | 'team'
> & {
  href: string;
  team?: {
    href: string;
  };
};
const LibraryCard: React.FC<LibraryCardProps> = ({
  publishDate,
  title,
  type,
  created,
  href,
  team,
}) => {
  return (
    <Card>
      <div css={containerStyles}>
        <div css={typeStyles}>
          <TagLabel>{type}</TagLabel>
        </div>
        <div css={moveStyles}>
          <Paragraph accent={'lead'}>via ASAP</Paragraph>
        </div>
        <div css={textStyles}>
          <Link theme={null} href={href}>
            <Headline2 styleAsHeading={4}>{title}</Headline2>
          </Link>
          {team && (
            <span css={teamMemberStyles}>
              <span css={iconStyles}>{teamIcon} </span>
              <Link href={team.href}>{team.displayName}</Link>
            </span>
          )}
        </div>
        <Caption accent={'lead'} asParagraph>
          Originally Published:
          {format(new Date(publishDate || created), ' Mo MMMM yyyy')}
        </Caption>
      </div>
    </Card>
  );
};

export default LibraryCard;
