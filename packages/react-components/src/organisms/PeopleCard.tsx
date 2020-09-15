import React from 'react';
import css from '@emotion/css';
import format from 'date-fns/format';
import { UserResponse } from '@asap-hub/model';

import { Card, Link, Headline2, Avatar, Caption } from '../atoms';
import { ProfilePersonalText } from '../molecules';
import { tabletScreen } from '../pixels';

const containerStyles = css({
  display: 'grid',
  columnGap: '25px',
  rowGap: '12px',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: 'min-content auto',
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
  | 'avatarURL'
  | 'department'
  | 'displayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'createdDate'
  | 'lastName'
  | 'location'
  | 'teams'
> & {
  readonly profileHref: string;
  readonly teamProfileHref?: string;
};
const PeopleCard: React.FC<PeopleCardProps> = ({
  department,
  displayName,
  institution,
  createdDate,
  firstName,
  lastName,
  location,
  teams,
  jobTitle,
  avatarURL,
  profileHref,
  teamProfileHref,
}) => {
  return (
    <Link theme={null} href={profileHref}>
      <Card>
        <section css={containerStyles}>
          <Avatar
            imageUrl={avatarURL}
            firstName={firstName}
            lastName={lastName}
          />
          <div css={textContainerStyles}>
            <div css={moveStyles}>
              <Headline2 styleAsHeading={4}>{displayName}</Headline2>
            </div>
            <div css={profileTextStyles}>
              <ProfilePersonalText
                department={department}
                institution={institution}
                location={location}
                jobTitle={jobTitle}
                teams={teams}
                teamProfileHref={teamProfileHref}
              />
            </div>
            <div css={moveStyles}>
              <Caption accent={'lead'} asParagraph>
                Joined: {format(new Date(createdDate), 'Mo MMMM yyyy')}
              </Caption>
            </div>
          </div>
        </section>
      </Card>
    </Link>
  );
};

export default PeopleCard;
