import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import {
  Anchor,
  Avatar,
  Card,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import UserCardInfo from '../molecules/UserCardInfo';

const { rem, tabletScreen } = pixels;

const avatarSize = 132;

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

type UserCardProps = Pick<
  ComponentProps<typeof UserCardInfo>,
  'region' | 'projects' | 'role' | 'workingGroups'
> & {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  degree: string[];
  tags: string[];
};
const UserCard: React.FC<UserCardProps> = ({
  id,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  degree,
  role,
  region,
  workingGroups,
  projects,
  tags,
}) => {
  const userHref = network({}).users({}).user({ userId: id }).$;

  return (
    <Card>
      <div css={[containerStyles]}>
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
              <h2 css={titleStyles}>
                {displayName}
                {degree && !!degree.length && `, ${degree.join(', ')}`}
              </h2>
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
