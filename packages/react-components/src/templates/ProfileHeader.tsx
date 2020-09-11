import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';
import { UserResponse } from '@asap-hub/model';

import { contentSidePaddingWithNavigation, tabletScreen } from '../pixels';
import { Avatar, Button, Paragraph, TabLink, Display } from '../atoms';
import { ProfilePersonalText, TabNav } from '../molecules';

const containerStyles = css({
  alignSelf: 'stretch',

  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

const personalInfoStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap-reverse',
  justifyContent: 'space-between',
  alignItems: 'start',
});

const actionsStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
});
const contactStyles = css({
  flexGrow: 1,
  alignSelf: 'center',

  display: 'flex',
  flexDirection: 'column',
});
const lastModifiedStyles = css({
  flexBasis: 0,
  flexGrow: 9999,

  textAlign: 'right',
  alignSelf: 'flex-end',

  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

type ProfileProps = Pick<
  UserResponse,
  | 'avatarURL'
  | 'department'
  | 'displayName'
  | 'firstName'
  | 'institution'
  | 'jobTitle'
  | 'lastModifiedDate'
  | 'lastName'
  | 'location'
  | 'teams'
> & {
  readonly aboutHref: string;
  readonly researchHref: string;
  readonly outputsHref: string;
  readonly teamProfileHref?: string;
};

const ProfileHeader: React.FC<ProfileProps> = ({
  department,
  displayName,
  institution,
  lastModifiedDate,
  firstName,
  lastName,
  location,
  teams,
  jobTitle,
  avatarURL,

  aboutHref,
  researchHref,
  outputsHref,
  teamProfileHref,
}) => {
  return (
    <header css={containerStyles}>
      <section css={personalInfoStyles}>
        <div>
          <Display styleAsHeading={2}>{displayName}</Display>
          <ProfilePersonalText
            department={department}
            institution={institution}
            location={location}
            jobTitle={jobTitle}
            teams={teams}
            teamProfileHref={teamProfileHref}
          />
        </div>
        <Avatar
          border
          imageUrl={avatarURL}
          firstName={firstName}
          lastName={lastName}
        />
      </section>
      <section css={actionsStyles}>
        <div css={contactStyles}>
          <Button small primary>
            Contact
          </Button>
        </div>
        {lastModifiedDate && (
          <div css={lastModifiedStyles}>
            <Paragraph accent="lead">
              <small>
                Last updated:{' '}
                {formatDistance(new Date(), new Date(lastModifiedDate))} ago
              </small>
            </Paragraph>
          </div>
        )}
      </section>
      <TabNav>
        <TabLink href={researchHref}>Research</TabLink>
        <TabLink href={aboutHref}>Background</TabLink>
        <TabLink href={outputsHref}>Shared Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default ProfileHeader;
