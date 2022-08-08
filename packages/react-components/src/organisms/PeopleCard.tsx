import { css } from '@emotion/react';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Avatar, Caption } from '../atoms';
import { LinkHeadline, UserProfilePersonalText, ImageLink } from '../molecules';
import { tabletScreen } from '../pixels';
import { formatDate } from '../date';

const containerStyles = css({
  display: 'grid',
  columnGap: '25px',
  rowGap: '12px',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '90px auto',
  },
});

const textContainerStyles = css({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'start',
});

const profileTextStyles = css({
  flexBasis: '100%',
});

const moveStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexBasis: 'auto',
    order: -1,
  },
});

type PeopleCardProps = Pick<
  UserResponse,
  | 'id'
  | 'avatarUrl'
  | 'displayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'createdDate'
  | 'lastName'
  | 'role'
  | 'teams'
  | 'degree'
  | 'labs'
>;
const PeopleCard: React.FC<PeopleCardProps> = ({
  id,
  displayName,
  createdDate,
  firstName,
  lastName,
  avatarUrl,
  degree,
  ...props
}) => {
  const userHref = network({}).users({}).user({ userId: id }).$;
  const userAvatar = (
    <Avatar imageUrl={avatarUrl} firstName={firstName} lastName={lastName} />
  );
  return (
    <Card>
      <div css={[containerStyles]}>
        <ImageLink placeholder={userAvatar} link={userHref} />
        <div css={textContainerStyles}>
          <div css={moveStyles}>
            <LinkHeadline href={userHref} level={2} styleAsHeading={4}>
              {displayName}
              {degree && `, ${degree}`}
            </LinkHeadline>
          </div>
          <div css={profileTextStyles}>
            <UserProfilePersonalText {...props} />
          </div>
          <div css={moveStyles}>
            <Caption accent={'lead'} asParagraph>
              Joined: {formatDate(new Date(createdDate))}
            </Caption>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PeopleCard;
