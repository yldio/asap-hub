import { GroupResponse, UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import { Divider, Link } from '../atoms';
import { lead } from '../colors';
import { TabbedCard } from '../molecules';
import { perRem, tabletScreen } from '../pixels';

const titleStyle = css({
  fontWeight: 'bold',
});

const roleStyle = css({
  color: lead.rgb,
});

const listItemStyle = css({
  display: 'grid',

  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 1fr',
  gridRowGap: `${12 / perRem}em`,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridAutoFlow: 'column',
    gridTemplateColumns: '1fr 1fr',

    '&:not(:first-of-type)': {
      gridTemplateRows: '1fr',
    },

    [`&:not(:first-of-type) > :nth-child(odd)`]: {
      display: 'none',
    },
  },
});

type UserInterestGroupItemProps = GroupResponse;

const UserInterestGroupItem: React.FC<UserInterestGroupItemProps> = ({
  id,
  name,
  leaders,
}) => (
  <Fragment key={`group-${id}`}>
    <Divider />
    <li css={listItemStyle}>
      <div css={[titleStyle]}>Group</div>
      <Link ellipsed href={network({}).groups({}).group({ groupId: id }).$}>
        {name}
      </Link>
      <div css={[titleStyle]}>Role</div>
      <div css={roleStyle}>
        {leaders.find((leader) => leader.user.id === id)?.role ?? 'Member'}
      </div>
    </li>
  </Fragment>
);

type UserInterestGroupCardProps = Pick<UserResponse, 'alumniSinceDate'> & {
  groups: GroupResponse[];
};

const UserInterestGroupCard: React.FC<UserInterestGroupCardProps> = ({
  groups,
}) => (
  <TabbedCard
    title="test"
    description="description"
    tabs={[
      {
        title: 'First',
        items: groups,
        createItem: (group) => <UserInterestGroupItem {...group} />,
        truncateFrom: 5,
      },
      {
        title: 'second',
        items: groups,
        createItem: (group) => <UserInterestGroupItem {...group} />,
        truncateFrom: 1,
      },
      {
        title: 'third',
        items: groups,
        createItem: (group) => <UserInterestGroupItem {...group} />,
      },
    ]}
  />
);

export default UserInterestGroupCard;
