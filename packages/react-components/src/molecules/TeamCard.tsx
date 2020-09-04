import React from 'react';
import css from '@emotion/css';
import { Card, Headline4, Link, Tag, Paragraph } from '../atoms';
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

interface TeamCardProps {
  id: string;
  displayName: string;
  projectSummary?: string; // Should this be optional?
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
        <Headline4>{displayName}</Headline4>
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
        {teamMembersIcon}
        <span>
          {' '}
          {members.length} Team Member
          {members.length !== 1 ? 's' : ''}
        </span>
      </Card>
    </Link>
  );
};

export default TeamCard;
