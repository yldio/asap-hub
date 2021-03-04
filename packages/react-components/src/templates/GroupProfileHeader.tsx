import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';
import { isEnabled } from '@asap-hub/flags';

import { paper, lead } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { Display, Link, TabLink } from '../atoms';
import { teamIcon } from '../icons';
import { TabNav } from '../molecules';

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,
});
const belowHeadlineStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  // All children must have at least +12 padding-top to avoid box breakout.
  // Why not just subtract it from the children then? For the wrapping case.
  // Hooray for no row-gap support in Safari.
  marginTop: `${-12 / perRem}em`,
});

interface GroupProfileHeaderProps {
  name: string;
  numberOfTeams: number;
  groupTeamsHref: string;
  lastModifiedDate: string;

  aboutHref: string;
  calendarHref: string;
  upcomingHref: string;
  pastHref: string;
}
const GroupProfileHeader: React.FC<GroupProfileHeaderProps> = ({
  name,
  numberOfTeams,
  groupTeamsHref,
  lastModifiedDate,
  aboutHref,
  calendarHref,
  upcomingHref,
  pastHref,
}) => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>{name}</Display>
    <div css={belowHeadlineStyles}>
      <div
        css={{
          paddingRight: `${15 / perRem}em`,
          paddingTop: `${24 / perRem}em`,
          display: 'grid',
        }}
      >
        {teamIcon}
      </div>
      <div
        css={{
          flexGrow: 1,
          paddingRight: `${30 / perRem}em`,
          paddingTop: `${24 / perRem}em`,
        }}
      >
        <Link href={groupTeamsHref}>
          {numberOfTeams} Team{numberOfTeams === 1 ? '' : 's'}
        </Link>
      </div>
      <div
        css={{
          paddingTop: `${24 / (13.6 / perRem) / perRem}em`,
          fontSize: `${13.6 / perRem}em`,
          color: lead.rgb,
        }}
      >
        Last updated: {formatDistance(new Date(), new Date(lastModifiedDate))}{' '}
        ago
      </div>
    </div>
    <TabNav>
      <TabLink href={aboutHref}>About</TabLink>
      <TabLink href={calendarHref}>Calendar</TabLink>
      {isEnabled('UPCOMING_EVENTS') && (
        <TabLink href={upcomingHref}>Upcoming Events</TabLink>
      )}
      {isEnabled('PAST_EVENTS') && (
        <TabLink href={pastHref}>Past Events</TabLink>
      )}
    </TabNav>
  </header>
);

export default GroupProfileHeader;
