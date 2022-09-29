import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Anchor,
  Avatar,
  Card,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserCardInfo from '../molecules/UserCardInfo';

const { rem, tabletScreen } = pixels;

const avatarSize = 132;

type UserCardProps = Pick<
  gp2Model.UserResponse,
  | 'id'
  | 'displayName'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'degrees'
  | 'region'
  | 'role'
> & {
  tags?: string[];
} & Partial<
    Pick<ComponentProps<typeof UserCardInfo>, 'projects' | 'workingGroups'>
  >;

const containerStyles = css({
  display: 'grid',
  columnGap: rem(32),
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${rem(avatarSize)} auto`,
  },
});

const textContainerStyles = css({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'start',
  flexDirection: 'column',
});
const titleStyles = css({
  margin: `8px 0`,
  fontWeight: 'bold',
  fontSize: '26px',
  lineHeight: '32px',
});
const avatarStyles = css({
  margin: 'auto',
  width: rem(avatarSize),
  height: rem(avatarSize),
});

const UserCard: React.FC<UserCardProps> = ({
  id,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  degrees,
  role,
  region,
  workingGroups = [],
  projects = [],
  tags = [],
}) => {
  const userHref = gp2.users({}).user({ userId: id }).$;

  return (
    <Card>
      <div css={containerStyles}>
        <Anchor href={userHref}>
          <Avatar
            imageUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            overrideStyles={avatarStyles}
          />
        </Anchor>

        <div css={textContainerStyles}>
          <div>
            <Anchor href={userHref}>
              <h3 css={titleStyles}>
                {displayName}
                {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
              </h3>
            </Anchor>
          </div>
          <UserCardInfo
            projects={projects}
            role={role}
            region={region}
            workingGroups={workingGroups}
          />
          <TagList max={4} tags={tags} />
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
