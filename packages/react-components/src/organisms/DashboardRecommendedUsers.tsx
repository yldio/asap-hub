import { UserListItemResponse } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { Card, Avatar, Ellipsis, Paragraph } from '../atoms';
import { ImageLink, LinkHeadline, TagList } from '../molecules';
import { perRem, tabletScreen } from '../pixels';

const NUMBER_OF_TAGS_TO_DISPLAY = 5;

const recommendedUsersStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: `${15 / perRem}em`,
  },
});

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${15 / perRem}em`,
});

const avatarStyles = css({
  width: `${96 / perRem}em`,
  height: `${96 / perRem}em`,
});

const roleStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

type DashboardRecommendedUsersProps = {
  recommendedUsers: UserListItemResponse[];
};

const DashboardRecommendedUsers: React.FC<DashboardRecommendedUsersProps> = ({
  recommendedUsers,
}) => (
  <div css={recommendedUsersStyles}>
    {recommendedUsers.map((user) => (
      <Card key={user.id}>
        <div css={containerStyles}>
          <ImageLink
            link={networkRoutes.DEFAULT.USERS.DETAILS.buildPath({
              id: user.id,
            })}
          >
            <Avatar
              overrideStyles={avatarStyles}
              imageUrl={user.avatarUrl}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </ImageLink>
          <LinkHeadline
            href={networkRoutes.DEFAULT.USERS.DETAILS.buildPath({
              id: user.id,
            })}
            level={3}
            noMargin
            title={`${user.displayName}${
              (user.degree && `, ${user.degree}`) || ''
            }`}
          >
            <Ellipsis>
              {user.displayName}
              {user.degree && `, ${user.degree}`}
            </Ellipsis>
          </LinkHeadline>
          {user.teams.length > 0 && user.teams[0] && (
            <div css={roleStyles}>
              <Paragraph noMargin accent="lead">
                {user.teams[0].role} on team
              </Paragraph>
              <Paragraph noMargin accent="lead">
                {user.teams[0].displayName}
              </Paragraph>
            </div>
          )}
          <TagList
            centerContent
            // eslint-disable-next-line no-underscore-dangle
            tags={user._tags}
            max={NUMBER_OF_TAGS_TO_DISPLAY}
          />
        </div>
      </Card>
    ))}
  </div>
);

export default DashboardRecommendedUsers;
