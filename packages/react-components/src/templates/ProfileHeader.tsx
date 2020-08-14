import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';
import { UserResponse } from '@asap-hub/model';

import {
  perRem,
  contentSidePaddingWithNavigation,
  tabletScreen,
} from '../pixels';
import { Avatar, Button, Link, Paragraph, TabLink, Display } from '../atoms';
import { TabNav } from '../molecules';

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
const mainTextStyles = css({
  padding: `${6 / perRem}em 0`,
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
  | 'department'
  | 'displayName'
  | 'institution'
  | 'orcidLastModifiedDate'
  | 'firstName'
  | 'lastName'
  | 'location'
  | 'teams'
  | 'jobTitle'
  | 'avatarURL'
> & {
  readonly aboutHref: string;
  readonly researchInterestsHref: string;
  readonly outputsHref: string;
};

const ProfileHeader: React.FC<ProfileProps> = ({
  department,
  displayName,
  institution,
  orcidLastModifiedDate,
  firstName,
  lastName,
  location,
  teams,
  jobTitle,
  avatarURL,

  aboutHref,
  researchInterestsHref,
  outputsHref,
}) => {
  const team = teams?.[0];

  return (
    <header css={containerStyles}>
      <section css={personalInfoStyles}>
        <div>
          <Display styleAsHeading={2}>{displayName}</Display>
          <div css={mainTextStyles}>
            <Paragraph>
              {jobTitle}
              {jobTitle && institution && ' at '}
              {institution}
              {institution && department && `, ${department}`}
              {team && (
                <>
                  <br />
                  {team.role} on{' '}
                  <Link href={`/teams/${team.id}`}>{team.displayName}</Link>
                </>
              )}
            </Paragraph>
            <Paragraph>{location}</Paragraph>
          </div>
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
        {orcidLastModifiedDate && (
          <div css={lastModifiedStyles}>
            <Paragraph accent="lead">
              <small>
                Last updated:{' '}
                {formatDistance(new Date(), new Date(orcidLastModifiedDate))}{' '}
                ago
              </small>
            </Paragraph>
          </div>
        )}
      </section>
      <TabNav>
        <TabLink href={aboutHref}>About</TabLink>
        <TabLink href={researchInterestsHref}>Research Interests</TabLink>
        <TabLink href={outputsHref}>Shared Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default ProfileHeader;
