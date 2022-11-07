import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';
import { TeamResponse } from '@asap-hub/model';
import { perRem } from '../pixels';
import { Anchor, Avatar } from '../atoms';

const MAX_USER_AVATARS = 5;
const USER_AVATAR_BORDER_WIDTH = 1;

const membersContainerStyles = css({
  gridArea: 'members',
  padding: `${12 / perRem}em 0`,

  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: `
    repeat(
      ${MAX_USER_AVATARS},
      minmax(auto, ${36 + USER_AVATAR_BORDER_WIDTH * 2}px)
    )
    ${6 / perRem}em
    minmax(auto, ${36 + USER_AVATAR_BORDER_WIDTH * 2}px)
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

type UsersAvatarsProps = Pick<TeamResponse, 'members'> & {
  fullListRoute: string;
};

const UsersAvatars: React.FC<UsersAvatarsProps> = ({
  members,
  fullListRoute,
}) => (
  <div css={membersContainerStyles}>
    <ul css={membersListStyles}>
      {members
        .slice(0, MAX_USER_AVATARS)
        .map(({ id: userId, avatarUrl, firstName, lastName }, i) => (
          <li key={userId} css={[listItemStyles, { left: `-${i * 3}px` }]}>
            <Anchor href={network({}).users({}).user({ userId: userId }).$}>
              <Avatar
                firstName={firstName}
                lastName={lastName}
                imageUrl={avatarUrl}
              />
            </Anchor>
          </li>
        ))}
      <li css={extraUsersStyles}>
        {members.length > MAX_USER_AVATARS && (
          <Anchor href={fullListRoute}>
            <Avatar placeholder={`+${members.length - MAX_USER_AVATARS}`} />
          </Anchor>
        )}
      </li>
    </ul>
  </div>
);

export default UsersAvatars;
