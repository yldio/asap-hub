import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { isInternalUser } from '@asap-hub/validation';

import { Avatar, Link } from '../atoms';
import { ImageLink } from '.';
import { perRem } from '../pixels';
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
  paddingBottom: `${12 / perRem}em`,
  '&:not(:last-of-type)': {
    paddingRight: `${24 / perRem}em`,
  },

  overflow: 'hidden',
});
const userStyles = css({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr min-content',
  gridColumnGap: `${9 / perRem}em`,
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
    | Pick<
        UserResponse,
        | 'displayName'
        | 'firstName'
        | 'lastName'
        | 'avatarUrl'
        | 'id'
        | 'email'
        | 'alumniSinceDate'
      >
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
      const link = user.id && network({}).users({}).user({ userId: user.id }).$;
      const internalUser = isInternalUser(user);
      const imageUrl = internalUser
        ? user.avatarUrl
        : getPlaceholderAvatarUrl();
      return (
        <li key={`author-${i}`} css={itemStyles}>
          {internalUser ? (
            <div css={userStyles}>
              <ImageLink link={link}>
                <Avatar {...user} imageUrl={imageUrl} />
              </ImageLink>
              <Link ellipsed href={link}>
                <span css={nameStyles}>{user.displayName}</span>
              </Link>
              {user.alumniSinceDate && (
                <span css={iconStyles}>{alumniBadgeIcon}</span>
              )}
            </div>
          ) : (
            <div css={userStyles}>
              <Avatar {...user} imageUrl={imageUrl} />
              <span css={nameStyles}>{user.displayName}</span>
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
