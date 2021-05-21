import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Avatar, Link } from '../atoms';
import { perRem } from '../pixels';
import { userPlaceholderIcon } from '../icons';

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
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

interface UsersListProps {
  users: ReadonlyArray<
    Pick<UserResponse, 'displayName'> &
      Partial<Pick<UserResponse, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>>
  >;
}
const UsersList: FC<UsersListProps> = ({ users }) => (
  <ul css={listStyles}>
    {users.map((user, i) => (
      <li key={user.id ?? i} css={itemStyles}>
        <Link
          href={user.id && network({}).users({}).user({ userId: user.id }).$}
        >
          <div css={userStyles}>
            <Avatar
              {...user}
              imageUrl={user.id ? user.avatarUrl : getPlaceholderAvatarUrl()}
            />
            <span css={nameStyles}>{user.displayName}</span>
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

export default UsersList;
