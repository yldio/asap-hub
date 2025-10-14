import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';
import { isExternalUser } from '@asap-hub/validation';

import { Avatar, Link } from '../atoms';
import { ImageLink } from '.';
import { rem } from '../pixels';
import { alumniBadgeIcon, userPlaceholderIcon } from '../icons';
import { lead } from '../colors';

const getPlaceholderAvatarUrl = () =>
  `data:image/svg+xml;base64,${btoa(
    renderToStaticMarkup(userPlaceholderIcon),
  )}`;

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,

  overflow: 'hidden',
  display: 'flex',
  flexWrap: 'wrap',

  color: lead.rgb,
});
const itemStyles = css({
  paddingBottom: rem(12),
  '&:not(:last-of-type)': {
    paddingRight: rem(24),
  },

  overflow: 'hidden',
});
const userStyles = css({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr min-content',
  gridColumnGap: rem(9),
  alignItems: 'center',
});
const nameStyles = css({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
const iconStyles = css({
  display: 'inline-flex',
});

interface UsersListProps {
  users: ReadonlyArray<
    | (Pick<
        UserResponse,
        | 'displayName'
        | 'firstName'
        | 'lastName'
        | 'avatarUrl'
        | 'id'
        | 'email'
        | 'alumniSinceDate'
      > & { href: string })
    | ExternalAuthorResponse
  >;
  max?: number;
}
const UsersList: FC<UsersListProps> = ({
  users,
  max = Number.POSITIVE_INFINITY,
}) => (
  <ul css={listStyles}>
    {users.slice(0, max).map((user, i) => {
      const externalUser = isExternalUser(user);
      const imageUrl = externalUser
        ? getPlaceholderAvatarUrl()
        : user.avatarUrl;
      return (
        <li key={`author-${i}`} css={itemStyles}>
          {externalUser ? (
            <div css={userStyles}>
              <Avatar {...user} imageUrl={imageUrl} />
              <span css={nameStyles}>{user.displayName}</span>
            </div>
          ) : (
            <div css={userStyles}>
              <ImageLink link={user.href}>
                <Avatar {...user} imageUrl={imageUrl} />
              </ImageLink>
              <Link ellipsed href={user.href}>
                <span css={nameStyles}>{user.displayName}</span>
              </Link>
              {user.alumniSinceDate && (
                <span css={iconStyles}>{alumniBadgeIcon}</span>
              )}
            </div>
          )}
        </li>
      );
    })}
    {users.length > max && (
      <li>
        <div css={userStyles}>
          <Avatar placeholder={`+${users.length - max}`} />
          <span css={nameStyles}>Authors</span>
        </div>
      </li>
    )}
  </ul>
);

export default UsersList;
