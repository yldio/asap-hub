import React from 'react';
import css from '@emotion/css';
import format from 'date-fns/format';

import { Card, Link, Headline2, Caption, TagLabel, Paragraph } from '../atoms';
import { tabletScreen, perRem } from '../pixels';
import { lead } from '../colors';
import { teamIcon } from '../icons';
import { ResearchOutputResponse } from '@asap-hub/model';

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
    order: -1,
  },
});

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});

type LibraryCardProps = Pick<
  ResearchOutputResponse,
  'publishDate' | 'title' | 'type' | 'created'
> & {};
const LibraryCard: React.FC<LibraryCardProps> = ({
  publishDate,
  title,
  type,
  created,
}) => {
  return (
    <Card>
      <section css={containerStyles}>
        <div css={moveStyles}>
          <div css={{ width: 'fit-content' }}>
            <TagLabel>{type}</TagLabel>
          </div>
        </div>
        <div css={textStyles}>
          <Link theme={null} href="#">
            <Headline2 styleAsHeading={4}>{title}</Headline2>
          </Link>
          <span css={teamMemberStyles}>
            <span css={iconStyles}>{teamIcon} </span>
            <Link href="#">Team Name</Link>
          </span>
        </div>

        <Caption accent={'lead'} asParagraph>
          Originally Published:
          {format(
            new Date(publishDate ? publishDate : created),
            ' Mo MMMM yyyy',
          )}
        </Caption>

        <div css={moveStyles}>
          <Paragraph accent={'lead'}>via ASAP</Paragraph>
        </div>
      </section>
    </Card>
  );
};

export default LibraryCard;
