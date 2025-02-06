import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';
import { Anchor, Avatar, Tooltip } from '../atoms';
import { rem } from '../pixels';

const MAX_USER_AVATARS = 2;
const USER_AVATAR_BORDER_WIDTH = 1;

const membersContainerStyles = (numColumns: number) =>
  css({
    gridArea: 'members',
    padding: `${rem(12)} 0`,

    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: `
    repeat(
      ${numColumns},
      minmax(auto, ${36 + USER_AVATAR_BORDER_WIDTH * 2}px)
    )   
  `,
  });

const membersListStyles = css({
  display: 'contents',
  listStyle: 'none',
});

const extraUsersStyles = css({
  width: '100%',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
});

const tooltipContainerStyles = css({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 0,
  height: 0,
  whiteSpace: 'pre-line',
  textAlign: 'center',
});

const listItemStyles = css({
  border: '1px solid white',
  borderRadius: '50%',
  position: 'relative',
});

export type Member = Pick<
  UserResponse,
  'id' | 'avatarUrl' | 'firstName' | 'lastName'
>;
type AssignedUsersAvatarListProps = {
  members: Array<Member>;
  small?: boolean;
};

export const getRemainingMembersText = (remainingMembers: Member[]) =>
  remainingMembers
    .map((member, index) => {
      if (remainingMembers.length === 1) {
        return `${member.firstName} ${member.lastName}`;
      }

      if (remainingMembers.length === 2) {
        return index === 0
          ? `${member.firstName} ${member.lastName} and`
          : `${member.firstName} ${member.lastName}`;
      }

      return index === remainingMembers.length - 2
        ? `${member.firstName} ${member.lastName} and`
        : index === remainingMembers.length - 1
          ? `${member.firstName} ${member.lastName}`
          : `${member.firstName} ${member.lastName},`;
    })
    .join('\n');

const AssignedUsersAvatarList: React.FC<AssignedUsersAvatarListProps> = ({
  members,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const remainingMembersText = getRemainingMembersText(
    members.slice(MAX_USER_AVATARS),
  );

  return (
    <div
      css={membersContainerStyles(
        members.length > MAX_USER_AVATARS
          ? MAX_USER_AVATARS + 1
          : members.length,
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
          <li
            css={css(extraUsersStyles)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar placeholder={`+${members.length - MAX_USER_AVATARS}`} />
            <div css={tooltipContainerStyles}>
              <Tooltip shown={isHovered}>{remainingMembersText}</Tooltip>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AssignedUsersAvatarList;
