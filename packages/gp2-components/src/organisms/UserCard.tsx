import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Anchor,
  Avatar,
  Card,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserCardInfo from '../molecules/UserCardInfo';

const { rem, tabletScreen } = pixels;

const avatarSize = 132;

type UserCardProps = Pick<
  gp2Model.UserResponse,
  | 'id'
  | 'fullDisplayName'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'degrees'
  | 'region'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'role'
> &
  Pick<ComponentProps<typeof UserCardInfo>, 'projects' | 'workingGroups'> & {
    tags?: string[];
  };

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
  overflowWrap: 'anywhere',
});
const avatarStyles = css({
  margin: 'auto',
  width: rem(avatarSize),
  height: rem(avatarSize),
});

const UserCard: React.FC<UserCardProps> = ({
  id,
  fullDisplayName,
  firstName,
  lastName,
  avatarUrl,
  degrees,
  role,
  region,
  country,
  stateOrProvince,
  city,
  workingGroups,
  projects,
  tags = [],
}) => {
  const userHref = gp2Routing.users({}).user({ userId: id }).$;

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
          <Anchor href={userHref}>
            <h3 css={titleStyles}>
              {fullDisplayName}
              {degrees && !!degrees.length && `, ${degrees.join(', ')}`}
            </h3>
          </Anchor>
          <UserCardInfo
            projects={projects}
            role={role}
            region={region}
            country={country}
            stateOrProvince={stateOrProvince}
            city={city}
            workingGroups={workingGroups}
          />
          <TagList max={3} tags={tags} />
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
