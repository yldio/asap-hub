import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ExternalAuthor,
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
    | ExternalAuthor
  >;
}
const UsersList: FC<UsersListProps> = ({ users }) => (
  <ul css={listStyles}>
    {users.map((user, i) => (
      <li key={`author-${i}`} css={itemStyles}>
        {isInternalAuthor(user) ? (
          <Link
            href={user.id && network({}).users({}).user({ userId: user.id }).$}
          >
            <div css={userStyles}>
              <Avatar {...user} />
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
  </ul>
);

export default UsersList;
