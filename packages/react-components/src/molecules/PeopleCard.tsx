import React from 'react';
import css from '@emotion/css';
import format from 'date-fns/format';
import { UserResponse } from '@asap-hub/model';

import { Card, Link, Headline2, Avatar, Caption } from '../atoms';
import ProfilePersonalText from './ProfilePersonalText';
import { tabletScreen } from '../pixels';

const containerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'min-content auto',
});

const textContainerStyles = css({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'start',
  '> *': {
    flexBasis: '100%',
  },
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    paddingTop: '12px',
  },
});

const moveStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexBasis: 'auto',
    order: -1,
  },
});

const avatarContainerStyles = css({
  paddingRight: '25px',
});

type PeopleCardProps = Pick<
  UserResponse,
  | 'id'
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
>;
const PeopleCard: React.FC<PeopleCardProps> = ({
  id,
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
}) => {
  return (
    <Link theme={null} href={`/users/${id}`}>
      <Card>
        <section css={containerStyles}>
          <div css={avatarContainerStyles}>
            <Avatar
              imageUrl={avatarURL}
              firstName={firstName}
              lastName={lastName}
            />
          </div>
          <div css={textContainerStyles}>
            <div css={moveStyles}>
              <Headline2 styleAsHeading={4}>{displayName}</Headline2>
            </div>
            <ProfilePersonalText
              department={department}
              institution={institution}
              location={location}
              jobTitle={jobTitle}
              teams={teams}
            />
            <div css={moveStyles}>
              <Caption>
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
