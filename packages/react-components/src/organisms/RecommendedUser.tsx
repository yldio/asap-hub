import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';
import { perRem } from '../pixels';
import { Avatar, Card, Ellipsis, Paragraph, Tag } from '../atoms';
import { ImageLink, LinkHeadline } from '../molecules';

const NUMBER_OF_TAGS_TO_DISPLAY = 5;

type RecommendedUserProps = {
  user: UserResponse;
};

const cardStyles = css({
  minHeight: `${600 / perRem}em`,
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

const tagListStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: `${15 / perRem}em`,
});

const RecommendedUser: React.FC<RecommendedUserProps> = ({ user }) => (
  <Card overrideStyles={cardStyles}>
    <div css={containerStyles}>
      <ImageLink link={network({}).users({}).user({ userId: user.id }).$}>
        <Avatar
          overrideStyles={avatarStyles}
          imageUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      </ImageLink>
      <LinkHeadline
        href={network({}).users({}).user({ userId: user.id }).$}
        level={3}
        noMargin
      >
        <Ellipsis title={user.displayName}>
          {user.displayName}
          {user.degree && `, ${user.degree}`}
        </Ellipsis>
      </LinkHeadline>
      {user.teams.length > 0 && (
        <div css={roleStyles}>
          <Paragraph hasMargin={false} accent="lead">
            {user.teams[0].role} on
          </Paragraph>
          <Paragraph hasMargin={false} accent="lead">
            {user.teams[0].displayName}
          </Paragraph>
        </div>
      )}
      <div css={tagListStyles}>
        {user.expertiseAndResourceTags
          .slice(0, NUMBER_OF_TAGS_TO_DISPLAY)
          .map((tag) => (
            <Tag title={tag}>{tag}</Tag>
          ))}
        {user.expertiseAndResourceTags.length > NUMBER_OF_TAGS_TO_DISPLAY && (
          <Tag>
            +{user.expertiseAndResourceTags.length - NUMBER_OF_TAGS_TO_DISPLAY}
          </Tag>
        )}
      </div>
    </div>
  </Card>
);

export default RecommendedUser;
