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
  readonly searchHref?: string;
}
const TeamCard: React.FC<TeamCardProps> = ({
  displayName,
  projectTitle,
  skills,
  members,
  href,
  searchHref,
}) => {
  return (
    <Card>
      <Link theme={null} href={href}>
        <Headline2 styleAsHeading={4}>Team {displayName}</Headline2>
        <Paragraph accent="lead">{projectTitle}</Paragraph>
      </Link>
      <TagList
        summarize
        tags={skills.map((label) => {
          let url;
          if (searchHref) {
            const searchHrefURL = new URL(searchHref);
            const searchParams = new URLSearchParams(searchHrefURL.search);
            searchParams.set('searchQuery', label);
            searchHrefURL.search = searchParams.toString();
            url = searchHrefURL.toString();
          }

          return {
            label,
            href: url,
          };
        })}
      />
      <span css={teamMemberStyles}>
        <span css={iconStyles}>{teamIcon} </span>
        {members.length} Team Member
        {members.length !== 1 ? 's' : ''}
      </span>
    </Card>
  );
};

export default TeamCard;
