import React from 'react';
import css from '@emotion/css';
import { UserResponse, UserTeam } from '@asap-hub/model';

import { perRem, tabletScreen } from '../pixels';
import { lead } from '../colors';
import { Link, Avatar } from '../atoms';

const containerStyles = css({
  margin: 0,
  padding: 0,
  display: 'grid',

  gridTemplateColumns: `${48 / perRem}em 1fr`,
  gridColumnGap: `${18 / perRem}em`,
  gridAutoFlow: 'row dense',
});
const multiColumnContainerStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${48 / perRem}em 1fr ${48 / perRem}em 1fr`,
  },
});

const avatarStyles = css({
  gridRowEnd: 'span 3',
  paddingTop: `${12 / perRem}em`,
});

const nameStyles = css({
  fontWeight: 'bold',
  paddingTop: `${12 / perRem}em`,
});

const addToColumnStyles = css({
  gridColumn: 2,
});
const multiColumnAddToColumnStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    'li:nth-of-type(2n) &': {
      gridColumn: 4,
    },
  },
});
const roleStyles = css({
  color: lead.rgb,
});
const teamStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `0 0 ${24 / perRem}em`,
});

interface MembersListProps {
  readonly members: ReadonlyArray<
    Pick<UserResponse, 'id' | 'displayName'> &
      Partial<Pick<UserResponse, 'firstName' | 'lastName' | 'avatarUrl'>> & {
        readonly href: string;
        readonly role: string;
        readonly teams: ReadonlyArray<
          Pick<UserTeam, 'displayName'> & {
            readonly href: string;
          }
        >;
      }
  >;
  singleColumn?: boolean;
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  singleColumn = false,
}) => (
  <ul css={[containerStyles, singleColumn || multiColumnContainerStyles]}>
    {members.map(({ id, href, displayName, role, teams, ...member }) => (
      <li key={id} css={{ display: 'contents' }}>
        <Link href={href} theme={null} display="contents">
          <div css={avatarStyles}>
            <Avatar
              firstName={member.firstName}
              lastName={member.lastName}
              imageUrl={member.avatarUrl}
            />
          </div>
        </Link>
        <Link href={href} theme={null} display="contents">
          <div css={nameStyles}>{displayName}</div>
        </Link>
        <Link href={href} theme={null} display="contents">
          <div
            css={[
              addToColumnStyles,
              singleColumn || multiColumnAddToColumnStyles,
              roleStyles,
            ]}
          >
            {role}
          </div>
        </Link>
        <ul
          css={[
            addToColumnStyles,
            singleColumn || multiColumnAddToColumnStyles,
            teamStyles,
          ]}
        >
          {teams.map((team, i) => (
            <li key={i}>
              <Link href={team.href}>{team.displayName}</Link>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export default MembersList;
