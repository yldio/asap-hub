import React from 'react';
import css from '@emotion/css';
import { GroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Headline2, Paragraph, Anchor } from '../atoms';
import { TagList } from '../molecules';
import { teamIcon } from '../icons';
import { perRem } from '../pixels';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

type GroupCardProps = Pick<
  GroupResponse,
  'id' | 'name' | 'description' | 'tags'
> & {
  readonly numberOfTeams: number;
};
const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  description,
  tags,
  numberOfTeams,
}) => (
  <Card>
    <Anchor href={network({}).groups({}).group({ groupId: id }).$}>
      <Headline2 styleAsHeading={4}>{name}</Headline2>
      <Paragraph accent="lead">{description}</Paragraph>
    </Anchor>
    <TagList min={2} max={3} tags={tags} />
    <Paragraph>
      <span css={iconStyles}>{teamIcon} </span>
      {numberOfTeams} Team
      {numberOfTeams === 1 ? '' : 's'}
    </Paragraph>
  </Card>
);
export default GroupCard;
