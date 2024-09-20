import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';

import { Link } from '../atoms';
import { alumniBadgeIcon } from '../icons';
import { rem } from '../pixels';

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

type UserTeamInfoProps = Pick<
  UserResponse,
  'displayName' | 'alumniSinceDate'
> & {
  userHref: string;
  teams: {
    href: string;
    name: string;
  }[];
};

const UserTeamInfo: FC<UserTeamInfoProps> = ({
  userHref,
  displayName,
  alumniSinceDate,
  teams,
}) => (
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
);
export default UserTeamInfo;
