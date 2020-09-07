import React from 'react';
import css from '@emotion/css';

import { Card, Link, Tag, Paragraph, Headline2 } from '../atoms';
import { perRem } from '../pixels';
import { TeamMember } from '../../../model/src';
import { teamMembersIcon } from '../icons';

const listStyles = css({
  padding: 0,
  listStyle: 'none',

  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',

  '> li:not(:last-of-type)': {
    paddingRight: `${12 / perRem}em`,
  },
});

const teamMemberStyles = css({
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
  id: string;
  displayName: string;
  projectSummary?: string;
  skills: string[];
  members: TeamMember[];
}
const TeamCard: React.FC<TeamCardProps> = ({
  id,
  displayName,
  projectSummary,
  skills,
  members,
}) => {
  const shownSkills = skills.slice(0, 2);
  const hiddenSkillsCount = skills.slice(2).length;

  return (
    <Link theme={null} href={`/teams/${id}`}>
      <Card>
        <Headline2 styleAsHeading={4}>{displayName}</Headline2>
        <Paragraph>{projectSummary}</Paragraph>
        {!!shownSkills.length && (
          <ul css={listStyles}>
            {shownSkills.map((skill, index) => (
              <li key={index}>
                <Tag>{skill}</Tag>
              </li>
            ))}
            {!!hiddenSkillsCount && (
              <li>
                <Tag>+{hiddenSkillsCount}</Tag>
              </li>
            )}
          </ul>
        )}
        <span css={teamMemberStyles}>
          <span css={iconStyles}>{teamMembersIcon} </span>
          {members.length} Team Member
          {members.length !== 1 ? 's' : ''}
        </span>
      </Card>
    </Link>
  );
};

export default TeamCard;
