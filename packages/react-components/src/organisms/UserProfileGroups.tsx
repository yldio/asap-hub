import React from 'react';
import { join } from 'path';

import { Card, Headline2, Paragraph, Link, Divider } from '../atoms';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';
import { perRem } from '../pixels';

const groupHref = '/network/groups';
const containerStyles = css({
  margin: 0,
  padding: 0,

  listStyle: 'none',
  display: 'grid',

  gridColumnGap: `${18 / perRem}em`,
});

const listItemStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr'
})

type UserProfileGroupsProps = Pick<UserResponse, 'firstName'> & {
  groups: ReadonlyArray<{
    id: string;
    name: string;
    role: 'Leader' | 'Member';
  }>;
};

const UserProfileGroups: React.FC<UserProfileGroupsProps> = ({
  firstName,
  groups,
}) => {
  const groupsComponent = groups.length ? (
    <ul css={[containerStyles]}>
      <li key="header" css={listItemStyle}>
        <div css={{ fontWeight: 'bold' }}>Group</div>
        <div css={{ fontWeight: 'bold' }}>Role</div>
      </li>
      {groups
        .flatMap(({ id, name, role }) => [
          <Divider key={`sep-${id}`} />,
          <li key={id} css={listItemStyle}>
            <Link href={join(groupHref, id)}>
              <Paragraph>{name}</Paragraph>
            </Link>
            <Paragraph accent="lead">{role}</Paragraph>
          </li>,
        ])
        .slice(1)}
    </ul>
  ) : null;

  return (
    <Card>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Headline2 styleAsHeading={3}>{firstName}’ Groups</Headline2>
        <Paragraph accent="lead">
          {firstName}’ team is collaborating with other teams via groups, which
          meet frequently
        </Paragraph>
        {groupsComponent}
      </div>
    </Card>
  );
};

export default UserProfileGroups;
