import { FC } from 'react';
import { css } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Author } from '@asap-hub/model';

import { Avatar, Link } from '../atoms';
import { ImageLink } from '.';
import { perRem } from '../pixels';
import { alumniBadgeIcon, userPlaceholderIcon } from '../icons';
import { lead } from '../colors';

const externalUserAvatar = `data:image/svg+xml;base64,${btoa(
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
  users: Author[];
  max?: number;
}

const UsersList: FC<UsersListProps> = ({
  users,
  max = Number.POSITIVE_INFINITY,
}) => (
  <ul css={listStyles}>
    {users.slice(0, max).map((author, i) => {
      if ('externalUser' in author) {
        return (
          <li key={`author-${i}`} css={itemStyles}>
            <div css={userStyles}>
              <Avatar {...author} imageUrl={externalUserAvatar} />
              <span css={nameStyles}>{author.externalUser.displayName}</span>
            </div>
          </li>
        );
      }

      return (
        <li key={`author-${i}`} css={itemStyles}>
          <div css={userStyles}>
            <ImageLink link={author.user.href}>
              <Avatar {...author.user} imageUrl={author.user.avatarUrl} />
            </ImageLink>
            <Link ellipsed href={author.user.href}>
              <span css={nameStyles}>{author.user.displayName}</span>
            </Link>
            {author.user.alumniSinceDate && (
              <span css={iconStyles}>{alumniBadgeIcon}</span>
            )}
          </div>
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
