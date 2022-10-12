import { GroupResponse, UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React from 'react';
import { Divider, Link } from '../atoms';
import { lead } from '../colors';
import { TabbedCard } from '../molecules';
import { perRem, tabletScreen } from '../pixels';

const dividerStyles = css({
  display: 'flex',
  height: `${42 / perRem}em`,
  flexDirection: 'column',
  justifyContent: 'center',
});

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

type UserInterestGroupItemProps = GroupResponse & {
  index: number;
};

const UserInterestGroupItem: React.FC<UserInterestGroupItemProps> = ({
  id,
  name,
  leaders,
  index,
}) => (
  <>
    {index !== 0 && (
      <div css={dividerStyles}>
        <Divider />
      </div>
    )}
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
  </>
);

type UserInterestGroupCardProps = Pick<
  UserResponse,
  'alumniSinceDate' | 'displayName'
> & {
  groups: GroupResponse[];
};

const UserInterestGroupCard: React.FC<UserInterestGroupCardProps> = ({
  displayName,
  alumniSinceDate,
  groups,
}) => (
  <TabbedCard
    title={`${displayName}'s Interest Groups`}
    description="Groups allow teams to share findings with other teams about topics of interest."
    activeTabIndex={alumniSinceDate ? 1 : 0}
    tabs={[
      {
        tabTitle: `Active Collaborations (${
          alumniSinceDate ? 0 : groups.length
        })`,
        items: groups,
        createItem: (group, index) => (
          <UserInterestGroupItem
            {...group}
            index={index}
            key={`group-${group.id}`}
          />
        ),
        truncateFrom: 5,
        disabled: alumniSinceDate !== undefined,
      },
      {
        tabTitle: `Past Collaborations (${
          alumniSinceDate ? groups.length : 0
        })`,
        items: groups,
        createItem: (group, index) => (
          <UserInterestGroupItem
            {...group}
            index={index}
            key={`group-${group.id}`}
          />
        ),
        truncateFrom: 5,
        disabled: alumniSinceDate === undefined,
      },
    ]}
  />
);

export default UserInterestGroupCard;
