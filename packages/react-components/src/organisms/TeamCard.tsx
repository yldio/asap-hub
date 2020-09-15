import React from 'react';
import css from '@emotion/css';

import { Card, Link, Paragraph, Headline2 } from '../atoms';
import { perRem } from '../pixels';
import { TeamMember } from '../../../model/src';
import { teamIcon } from '../icons';
import { TagList } from '../molecules';
import { lead } from '../colors';

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

interface TeamCardProps {
  readonly displayName: string;
  readonly projectSummary?: string;
  readonly skills: string[];
  readonly members: TeamMember[];
  readonly teamProfileHref: string;
}
const TeamCard: React.FC<TeamCardProps> = ({
  displayName,
  projectSummary,
  skills,
  members,
  teamProfileHref,
}) => {
  return (
    <Link theme={null} href={teamProfileHref}>
      <Card>
        <Headline2 styleAsHeading={4}>{displayName}</Headline2>
        <Paragraph accent="lead">{projectSummary}</Paragraph>
        <TagList summarize tags={skills} />
        <span css={teamMemberStyles}>
          <span css={iconStyles}>{teamIcon} </span>
          {members.length} Team Member
          {members.length !== 1 ? 's' : ''}
        </span>
      </Card>
    </Link>
  );
};

export default TeamCard;
