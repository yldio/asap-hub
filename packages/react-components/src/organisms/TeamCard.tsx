import React from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Anchor, Paragraph, Headline2 } from '../atoms';
import { perRem } from '../pixels';
import { teamIcon } from '../icons';
import { TagList } from '../molecules';
import { lead } from '../colors';

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
});
const tagsPadding = css({
  paddingBottom: `${12 / perRem}em`,
});
const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});

type TeamCardProps = Pick<
  TeamResponse,
  'id' | 'displayName' | 'projectTitle' | 'skills' | 'members'
>;

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  displayName,
  projectTitle,
  skills,
  members,
}) => (
  <Card>
    <Anchor href={network({}).teams({}).team({ teamId: id }).$}>
      <Headline2 styleAsHeading={4}>Team {displayName}</Headline2>
      <Paragraph accent="lead">{projectTitle}</Paragraph>
    </Anchor>
    {!!skills.length && (
      <div css={tagsPadding}>
        <TagList min={5} max={5} tags={skills} />
      </div>
    )}

    <span css={teamMemberStyles}>
      <span css={iconStyles}>{teamIcon} </span>
      {members.length} Team Member
      {members.length !== 1 ? 's' : ''}
    </span>
  </Card>
);

export default TeamCard;
