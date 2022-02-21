import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ExternalAuthorResponse,
  UserResponse,
  isInternalAuthor,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Avatar, Link } from '../atoms';
import { perRem } from '../pixels';
import { userPlaceholderIcon } from '../icons';
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
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${6 / perRem}em`,
  alignItems: 'center',
});
const nameStyles = css({
  fontSize: `${13.6 / perRem}em`,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

interface UsersListProps {
  users: ReadonlyArray<
    | Pick<
        UserResponse,
        'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'id'
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
    {users.slice(0, max).map((user, i) => (
      <li key={`author-${i}`} css={itemStyles}>
        {isInternalAuthor(user) ? (
          <Link
            href={user.id && network({}).users({}).user({ userId: user.id }).$}
          >
            <div css={userStyles}>
              <Avatar {...user} imageUrl={user.avatarUrl} />
              <span css={nameStyles}>{user.displayName}</span>
            </div>
          </Link>
        ) : (
          <div css={userStyles}>
            <Avatar {...user} imageUrl={getPlaceholderAvatarUrl()} />
            <span css={nameStyles}>{user.displayName}</span>
          </div>
        )}
      </li>
    ))}
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
