import { eventRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Display, Paragraph, TabLink } from '../atoms';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { TabNav } from '../molecules';
import { EventSearch } from '../organisms';
import { perRem } from '../pixels';
import { queryParamString } from '../routing';

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  marginBottom: `${30 / perRem}em`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const controlsStyles = css({
  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

type EventsPageHeaderProps = ComponentProps<typeof EventSearch>;
const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({
  searchQuery,
  onChangeSearchQuery,
}) => (
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
          <TabLink
            href={
              eventRoutes.DEFAULT.UPCOMING.buildPath({}) +
              queryParamString(searchQuery)
            }
          >
            Upcoming Events
          </TabLink>
          <TabLink
            href={
              eventRoutes.DEFAULT.PAST.buildPath({}) +
              queryParamString(searchQuery)
            }
          >
            Past Events
          </TabLink>
          <TabLink href={eventRoutes.DEFAULT.CALENDAR.buildPath({})}>
            Subscribe to Calendars
          </TabLink>
        </TabNav>
      </div>
    </div>
    <div css={controlsStyles}>
      <EventSearch
        searchQuery={searchQuery}
        onChangeSearchQuery={onChangeSearchQuery}
      />
    </div>
  </header>
);

export default EventsPageHeader;
