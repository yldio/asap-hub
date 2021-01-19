import React from 'react';
import css from '@emotion/css';
import { Card, Headline2, Paragraph, Link } from '../atoms';
import { TagList } from '../molecules';
import { teamIcon } from '../icons';
import { perRem } from '../pixels';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

interface GroupCardProps {
  name: string;
  href: string;
  description: string;
  tags: string[];
  numberOfTeams: number;
}
const GroupCard: React.FC<GroupCardProps> = ({
  name,
  href,
  description,
  tags,
  numberOfTeams,
}) => (
  <Card>
    <Link theme={null} href={href}>
      <Headline2 styleAsHeading={4}>{name}</Headline2>
      <Paragraph accent="lead">{description}</Paragraph>
    </Link>
    <TagList min={2} max={3} tags={tags} />
    <Paragraph>
      <span css={iconStyles}>{teamIcon} </span>
      {numberOfTeams} Team
      {numberOfTeams === 1 ? '' : 's'}
    </Paragraph>
  </Card>
);
export default GroupCard;
