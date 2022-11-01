import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';
import { perRem } from '../pixels';
import { Anchor, Avatar } from '../atoms';
import { TeamResponse } from '@asap-hub/model';

const MAX_MEMBER_AVATARS = 5;
const MEMBER_AVATAR_BORDER_WIDTH = 1;

const membersContainerStyles = css({
  gridArea: 'members',
  padding: `${12 / perRem}em 0`,

  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: `
    repeat(
      ${MAX_MEMBER_AVATARS},
      minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
    )
    ${6 / perRem}em
    minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
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

type MembersAvatarsProps = Pick<TeamResponse, 'members'> & {
  fullListRoute: string;
};

const MembersAvatars: React.FC<MembersAvatarsProps> = ({
  members,
  fullListRoute,
}) => {
  return (
    <div css={membersContainerStyles}>
      <ul css={membersListStyles}>
        {members
          .slice(0, MAX_MEMBER_AVATARS)
          .map(({ id: memberId, avatarUrl, firstName, lastName }, i) => (
            <li key={memberId} css={[listItemStyles, { left: `-${i * 3}px` }]}>
              <Anchor href={network({}).users({}).user({ userId: memberId }).$}>
                <Avatar
                  firstName={firstName}
                  lastName={lastName}
                  imageUrl={avatarUrl}
                />
              </Anchor>
            </li>
          ))}
        <li css={extraUsersStyles}>
          {members.length > MAX_MEMBER_AVATARS && (
            <Anchor href={fullListRoute}>
              <Avatar placeholder={`+${members.length - MAX_MEMBER_AVATARS}`} />
            </Anchor>
          )}
        </li>
      </ul>
    </div>
  );
};
export default MembersAvatars;
