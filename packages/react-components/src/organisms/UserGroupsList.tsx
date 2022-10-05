import { GroupResponse, UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import { Divider, Link } from '../atoms';
import { lead } from '../colors';
import { perRem, tabletScreen } from '../pixels';

const titleStyle = css({
  fontWeight: 'bold',
});

const roleStyle = css({
  color: lead.rgb,
});

const containerStyles = css({
  display: 'grid',

  gridColumnGap: `${18 / perRem}em`,

  margin: 0,
  marginTop: `${24 / perRem}em`,

  padding: 0,
  listStyle: 'none',
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

type UserGroupListProps = Pick<UserResponse, 'id'> & {
  readonly groups: ReadonlyArray<GroupResponse>;
};

const UserGroupsList: React.FC<UserGroupListProps> = ({ id, groups }) => (
  <ul css={containerStyles}>
    {groups.map((group, idx) => (
      <Fragment key={`group-${idx}`}>
        {idx === 0 || <Divider />}
        <li key={idx} css={listItemStyle}>
          <div css={[titleStyle]}>Group</div>
          <Link
            ellipsed
            href={network({}).groups({}).group({ groupId: group.id }).$}
          >
            {group.name}
          </Link>
          <div css={[titleStyle]}>Role</div>
          <div css={roleStyle}>
            {group.leaders.find((leader) => leader.user.id === id)?.role ??
              'Member'}
          </div>
        </li>
      </Fragment>
    ))}
  </ul>
);

export default UserGroupsList;
