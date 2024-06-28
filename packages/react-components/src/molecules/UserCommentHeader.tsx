import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';

import { Avatar, Link } from '../atoms';
import { lead } from '../colors';
import { formatDate } from '../date';
import { alumniBadgeIcon } from '../icons';
import { rem } from '../pixels';
import { ImageLink } from '.';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
});

const userContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
});

const userAndTeamContainerStyles = css({ display: 'flex', gap: rem(4) });

const nameStyles = css({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const teamStyles = css({
  display: 'flex',
});

const iconStyles = css({
  display: 'inline-flex',
});

const dateStyles = css({
  color: lead.rgb,
  fontSize: rem(14),
  fontWeight: 400,
});

type UserCommentHeaderProps = Pick<
  UserResponse,
  'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'alumniSinceDate'
> & {
  userHref: string;
  teams: {
    href: string;
    name: string;
  }[];
  date: string;
};

const UserCommentHeader: FC<UserCommentHeaderProps> = ({
  userHref,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  alumniSinceDate,
  teams,
  date,
}) => (
  <div css={containerStyles}>
    <div css={userContainerStyles}>
      <ImageLink link={userHref}>
        <Avatar
          firstName={firstName}
          lastName={lastName}
          imageUrl={avatarUrl}
        />
      </ImageLink>
      <div css={userAndTeamContainerStyles}>
        <Link ellipsed href={userHref}>
          <span css={nameStyles}>{displayName}</span>
        </Link>
        {alumniSinceDate && <span css={iconStyles}>{alumniBadgeIcon}</span>}
        {teams.length === 1 ? (
          <span css={[teamStyles, nameStyles]}>
            (
            <Link ellipsed href={teams[0]?.href}>
              <span css={nameStyles}>{teams[0]?.name}</span>
            </Link>
            )
          </span>
        ) : (
          <span css={[teamStyles, nameStyles]}>
            (
            <Link ellipsed href={userHref}>
              <span css={nameStyles}>Multiple teams</span>
            </Link>
            )
          </span>
        )}
      </div>
    </div>
    <span> · </span>
    <span css={dateStyles}>{formatDate(new Date(date))}</span>
  </div>
);
export default UserCommentHeader;
