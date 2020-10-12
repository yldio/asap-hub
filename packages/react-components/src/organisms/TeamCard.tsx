import React from 'react';
import css from '@emotion/css';
import { TeamMember } from '@asap-hub/model';

import { Card, Link, Paragraph, Headline2 } from '../atoms';
import { perRem } from '../pixels';
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
  readonly projectTitle: string;
  readonly skills: string[];
  readonly members: TeamMember[];
  readonly href: string;
}
const TeamCard: React.FC<TeamCardProps> = ({
  displayName,
  projectTitle,
  skills,
  members,
  href,
}) => {
  return (
    <Card>
      <Link theme={null} href={href}>
        <Headline2 styleAsHeading={4}>Team {displayName}</Headline2>
        <Paragraph accent="lead">{projectTitle}</Paragraph>
      </Link>
      <TagList summarize tags={skills} />
      <span css={teamMemberStyles}>
        <span css={iconStyles}>{teamIcon} </span>
        {members.length} Team Member
        {members.length !== 1 ? 's' : ''}
      </span>
    </Card>
  );
};

export default TeamCard;
