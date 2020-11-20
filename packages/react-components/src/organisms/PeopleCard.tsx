import React from 'react';
import css from '@emotion/css';
import { UserResponse, UserTeam } from '@asap-hub/model';

import { Card, Link, Headline2, Avatar, Caption } from '../atoms';
import { UserProfilePersonalText } from '../molecules';
import { tabletScreen } from '../pixels';
import { formatDate } from '../utils';

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
  | 'avatarUrl'
  | 'department'
  | 'displayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'createdDate'
  | 'lastName'
  | 'location'
  | 'role'
> & {
  readonly href: string;
  readonly teams: ReadonlyArray<UserTeam & { href: string }>;
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
  avatarUrl,
  href,
  role,
}) => {
  return (
    <Card>
      <div css={[containerStyles]}>
        <Link theme={null} href={href}>
          <Avatar
            imageUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
          />
        </Link>
        <div css={textContainerStyles}>
          <div css={moveStyles}>
            <Link theme={null} href={href}>
              <Headline2 styleAsHeading={4}>{displayName}</Headline2>
            </Link>
          </div>
          <div css={profileTextStyles}>
            <UserProfilePersonalText
              department={department}
              institution={institution}
              location={location}
              jobTitle={jobTitle}
              teams={teams}
              role={role}
              discoverHref={'/discover'}
            />
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
