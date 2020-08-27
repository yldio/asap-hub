import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';
import { UserResponse } from '@asap-hub/model';

import {
  perRem,
  contentSidePaddingWithNavigation,
  tabletScreen,
  lineHeight,
} from '../pixels';
import { Avatar, Button, Link, Paragraph, TabLink, Display } from '../atoms';
import { TabNav } from '../molecules';
import { locationIcon } from '../icons';

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
  paddingBottom: `${6 / perRem}em`,
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

const locationStyles = css({
  display: 'flex',
  alignItems: 'center',
});
const iconStyles = css({
  display: 'inline-block',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
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
            {location && (
              <Paragraph>
                <span css={locationStyles}>
                  <span css={iconStyles}>{locationIcon}</span>
                  {location}
                </span>
              </Paragraph>
            )}
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
