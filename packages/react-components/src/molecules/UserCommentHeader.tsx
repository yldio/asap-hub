import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';

import { Avatar } from '../atoms';
import { lead } from '../colors';
import { formatDate } from '../date';
import { rem } from '../pixels';
import { ImageLink } from '.';
import UserTeamInfo from './UserTeamInfo';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(6),
});

const userContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
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
      <UserTeamInfo
        displayName={displayName}
        userHref={userHref}
        teams={teams}
        alumniSinceDate={alumniSinceDate}
      />
    </div>
    <span> · </span>
    <span css={dateStyles}>{formatDate(new Date(date))}</span>
  </div>
);
export default UserCommentHeader;
