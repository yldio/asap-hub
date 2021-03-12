import React from 'react';
import css from '@emotion/css';
import { isEnabled } from '@asap-hub/flags';
import { events } from '@asap-hub/routing';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { TabNav } from '../molecules';

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  marginBottom: `${30 / perRem}em`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const EventsPageHeader: React.FC = () => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Calendar and Events</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Find out about upcoming events from ASAP and Groups. You can easily
          add specific calendars to your own Google Calendar to easily stay
          updated.
        </Paragraph>
        <TabNav>
          <TabLink href={events({}).calendar({}).$}>Calendar</TabLink>
          {isEnabled('UPCOMING_EVENTS') && (
            <TabLink href={events({}).upcoming({}).$}>Upcoming Events</TabLink>
          )}
          {isEnabled('PAST_EVENTS') && (
            <TabLink href={events({}).past({}).$}>Past Events</TabLink>
          )}
        </TabNav>
      </div>
    </div>
  </header>
);

export default EventsPageHeader;
