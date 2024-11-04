import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';
import { UserResponse } from '@asap-hub/model';
import { rem } from '../pixels';
import { Anchor, Avatar, Button } from '../atoms';

const MAX_USER_AVATARS = 5;
const USER_AVATAR_BORDER_WIDTH = 1;

const membersContainerStyles = (width: number, numColumns: number) =>
  css({
    gridArea: 'members',
    padding: `${rem(12)} 0`,

    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: `
    repeat(
      ${numColumns},
      minmax(auto, ${width + USER_AVATAR_BORDER_WIDTH * 2}px)
    )   
  `,
  });

const membersListStyles = css({
  display: 'contents',
  listStyle: 'none',
});

const extraUsersStyles = css({
  display: 'block',
  gridColumnEnd: '-1',
});

const listItemStyles = css({
  border: '1px solid white',
  borderRadius: '50%',
  position: 'relative',
});

type UserAvatarListProps = {
  members: Array<
    Pick<UserResponse, 'id' | 'avatarUrl' | 'firstName' | 'lastName'>
  >;
  fullListRoute?: string;
  onClick?: () => void;
  small?: boolean;
};

const UserAvatarList: React.FC<UserAvatarListProps> = ({
  members,
  fullListRoute,
  onClick,
  small = false,
}) => (
  <div
    css={membersContainerStyles(
      small === true ? 24 : 36,
      members.length > MAX_USER_AVATARS ? MAX_USER_AVATARS + 1 : members.length,
    )}
  >
    <ul css={membersListStyles}>
      {members
        .slice(0, MAX_USER_AVATARS)
        .map(({ id: userId, avatarUrl, firstName, lastName }, i) => (
          <li
            key={`${userId}${i}`}
            css={[listItemStyles, { left: `-${i * 3}px` }]}
          >
            <Anchor href={network({}).users({}).user({ userId }).$}>
              <Avatar
                firstName={firstName}
                lastName={lastName}
                imageUrl={avatarUrl}
              />
            </Anchor>
          </li>
        ))}
      {members.length > MAX_USER_AVATARS && (
        <li css={extraUsersStyles}>
          {fullListRoute && (
            <Anchor href={fullListRoute}>
              <Avatar placeholder={`+${members.length - MAX_USER_AVATARS}`} />
            </Anchor>
          )}
          {onClick && (
            <Button
              onClick={onClick}
              linkStyle
              overrideStyles={css({ display: 'flex', margin: rem(1) })}
            >
              <Avatar placeholder={`+${members.length - MAX_USER_AVATARS}`} />
            </Button>
          )}
        </li>
      )}
    </ul>
  </div>
);

export default UserAvatarList;
