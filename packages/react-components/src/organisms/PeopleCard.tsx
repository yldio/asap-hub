import { css } from '@emotion/react';
import { UserListItemResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Avatar, Caption, StateTag } from '../atoms';
import { LinkHeadline, UserProfilePersonalText, ImageLink } from '../molecules';
import { tabletScreen, perRem } from '../pixels';
import { formatDate } from '../date';
import { alumniBadgeIcon } from '../icons';

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
    display: 'flex',
    alignItems: 'baseline',
    columnGap: `${15 / perRem}em`,
    flexBasis: 'auto',
    order: -1,
  },
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    marginBottom: `${15 / perRem}em`,
  },
});

const alumniBadgeStyles = css({});

const PeopleCard: React.FC<UserListItemResponse> = ({
  id,
  alumniSinceDate,
  fullDisplayName,
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
    <Card accent={alumniSinceDate ? 'neutral200' : undefined}>
      <div css={[containerStyles]}>
        <ImageLink link={userHref}>{userAvatar}</ImageLink>
        <div css={textContainerStyles}>
          <div css={moveStyles}>
            <LinkHeadline href={userHref} level={2} styleAsHeading={4}>
              {fullDisplayName}
              {degree && `, ${degree}`}
            </LinkHeadline>
            {alumniSinceDate && (
              <span css={alumniBadgeStyles}>
                <StateTag icon={alumniBadgeIcon} label="Alumni" />
              </span>
            )}
          </div>

          <div css={profileTextStyles}>
            <UserProfilePersonalText {...props} />
          </div>
          <Caption accent={'lead'} asParagraph>
            {alumniSinceDate
              ? `Alumni since: ${formatDate(new Date(alumniSinceDate))}`
              : `Joined: ${formatDate(new Date(createdDate))}`}
          </Caption>
        </div>
      </div>
    </Card>
  );
};

export default PeopleCard;
