import { FC, Fragment } from 'react';
import { UserResponse, GroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import { Card, Headline2, Paragraph, Link, Divider } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import * as colors from '../colors';

const titleStyle = css({
  fontWeight: 'bold',
});

const roleStyle = css({
  color: colors.lead.rgb,
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

type UserProfileGroupsProps = Pick<UserResponse, 'firstName' | 'id'> & {
  readonly groups: ReadonlyArray<GroupResponse>;
};
const UserProfileGroups: FC<UserProfileGroupsProps> = ({
  firstName,
  id,
  groups,
}) => (
  <Card>
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Headline2 styleAsHeading={3}>{firstName}’s Groups</Headline2>
      <Paragraph accent="lead">
        {firstName}’s team is collaborating with other teams via groups, which
        meet frequently
      </Paragraph>
      {!!groups.length && (
        <ul css={[containerStyles]}>
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
                  {group.leaders.find((leader) => leader.user.id === id)
                    ?.role ?? 'Member'}
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  </Card>
);
export default UserProfileGroups;
