import React from 'react';
import css from '@emotion/css';
import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2, Caption, TagLabel } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';
import { teamIcon } from '../icons';
import { ExternalLink } from '../molecules';
import { formatDate } from '../date';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const headerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const textStyles = css({
  flexBasis: '100%',
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

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  'id' | 'created' | 'addedDate' | 'team' | 'title' | 'type' | 'link'
>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id,
  created,
  link,
  addedDate,
  team,
  title,
  type,
}) => (
  <Card>
    <div css={containerStyles}>
      <div css={headerStyles}>
        <div css={typeStyles}>
          <TagLabel>{type}</TagLabel>
        </div>
        {link ? (
          <ExternalLink label={researchOutputLabels[type]} href={link} />
        ) : null}
      </div>
      <div css={textStyles}>
        <Anchor
          href={sharedResearch({}).researchOutput({ researchOutputId: id }).$}
        >
          <Headline2 styleAsHeading={4}>{title}</Headline2>
        </Anchor>
        {team && (
          <span css={teamMemberStyles}>
            <span css={iconStyles}>{teamIcon}</span>
            <Anchor href={network({}).teams({}).team({ teamId: team.id }).$}>
              Team {team.displayName}
            </Anchor>
          </span>
        )}
      </div>
      <Caption accent={'lead'} asParagraph>
        Date Added: {formatDate(new Date(addedDate || created))}
      </Caption>
    </div>
  </Card>
);

export default SharedResearchCard;
