import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Paragraph, Anchor, StateTag } from '../atoms';
import { LinkHeadline, TagList } from '../molecules';
import { teamIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

const titleStyle = css({
  display: 'flex',
  flexFlow: 'row',
  gap: `${16 / perRem}em`,
  alignItems: 'center',
  marginBottom: `${-12 / perRem}em`,
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    flexFlow: 'column-reverse',
    gap: 0,
    alignItems: 'flex-start',
  },
});

type GroupCardProps = Pick<
  GroupResponse,
  'id' | 'name' | 'description' | 'tags' | 'active'
> & {
  readonly numberOfTeams: number;
};
const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  description,
  tags,
  numberOfTeams,
  active,
}) => (
  <Card accent={active ? 'default' : 'neutral200'}>
    <div css={titleStyle}>
      <LinkHeadline
        href={network({}).groups({}).group({ groupId: id }).$}
        level={2}
        styleAsHeading={4}
      >
        {name}
      </LinkHeadline>
      {!active && <StateTag label="Inactive" />}
    </div>
    <Anchor href={network({}).groups({}).group({ groupId: id }).$}>
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
