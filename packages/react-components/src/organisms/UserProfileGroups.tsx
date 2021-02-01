import React from 'react';
import { UserResponse, GroupRole } from '@asap-hub/model';
import css from '@emotion/css';
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

type UserProfileGroupsProps = Pick<UserResponse, 'firstName'> & {
  groups: ReadonlyArray<{
    name: string;
    role: GroupRole | 'Member';
    href: string;
  }>;
};

const UserProfileGroups: React.FC<UserProfileGroupsProps> = ({
  firstName,
  groups,
}) => {
  const groupsComponent = groups.length ? (
    <ul css={[containerStyles]}>
      {groups
        .flatMap(({ name, role, href }, idx) => [
          <Divider key={`sep-${idx}`} />,
          <li key={idx} css={listItemStyle}>
            <div css={[titleStyle]}>Group</div>
            <Link href={href}>{name}</Link>
            <div css={[titleStyle]}>Role</div>
            <div css={roleStyle}>{role}</div>
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
          {firstName}’s team is collaborating with other teams via groups, which
          meet frequently
        </Paragraph>
        {groupsComponent}
      </div>
    </Card>
  );
};

export default UserProfileGroups;
