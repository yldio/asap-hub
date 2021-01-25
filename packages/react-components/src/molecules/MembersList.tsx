import React from 'react';
import css from '@emotion/css';

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
  paddingBottom: `${24 / perRem}em`,
});

// TODO pass user href in from outside
interface MembersListProps {
  readonly members: ReadonlyArray<{
    readonly id: string;
    readonly displayName: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly avatarUrl?: string;
    readonly role: string;
    readonly team?: {
      readonly name: string;
      readonly href: string;
    };
  }>;
  singleColumn?: boolean;
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  singleColumn = false,
}) => (
  <ul css={[containerStyles, singleColumn || multiColumnContainerStyles]}>
    {members.map(
      ({ id, displayName, firstName, lastName, avatarUrl, role, team }) => (
        <li key={id} css={{ display: 'contents' }}>
          <Link href={`/network/users/${id}`} theme={null} display="contents">
            <div css={avatarStyles}>
              <Avatar
                imageUrl={avatarUrl}
                firstName={firstName}
                lastName={lastName}
              />
            </div>
          </Link>
          <Link href={`/network/users/${id}`} theme={null} display="contents">
            <div css={nameStyles}>{displayName}</div>
          </Link>
          <Link href={`/network/users/${id}`} theme={null} display="contents">
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
          <div
            css={[
              addToColumnStyles,
              singleColumn || multiColumnAddToColumnStyles,
              teamStyles,
            ]}
          >
            {team && <Link href={team.href}>{team.name}</Link>}
          </div>
        </li>
      ),
    )}
  </ul>
);

export default MembersList;
