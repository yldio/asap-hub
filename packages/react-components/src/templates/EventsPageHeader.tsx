import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Display, Paragraph, TabLink } from '../atoms';
import { TabNav } from '../molecules';
import { EventSearch } from '../organisms';
import { rem, smallDesktopScreen } from '../pixels';
import { queryParamString } from '../routing';
import PageConstraints from './PageConstraints';
import PageInfoContainer from './PageInfoContainer';

const textStyles = css({
  maxWidth: rem(smallDesktopScreen.width),
});

type EventsPageHeaderProps = ComponentProps<typeof EventSearch>;
const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({
  searchQuery,
  onChangeSearchQuery,
}) => (
  <header>
    <PageInfoContainer
      nav={
        <TabNav>
          <TabLink
            href={events({}).upcoming({}).$ + queryParamString(searchQuery)}
          >
            Upcoming Events
          </TabLink>
          <TabLink href={events({}).past({}).$ + queryParamString(searchQuery)}>
            Past Events
          </TabLink>
          <TabLink href={events({}).calendar({}).$}>
            Subscribe to Calendars
          </TabLink>
        </TabNav>
      }
    >
      <Display styleAsHeading={2}>Calendar and Events</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Find out about upcoming events from ASAP and Groups. You can easily
          add specific calendars to your own Google Calendar to easily stay
          updated.
        </Paragraph>
      </div>
    </PageInfoContainer>

    {/* the searchQuery might be an empty string, in which case we still want to show the search box */}
    {searchQuery === undefined ? null : (
      <PageConstraints noPaddingBottom>
        <EventSearch
          searchQuery={searchQuery}
          onChangeSearchQuery={onChangeSearchQuery}
        />
      </PageConstraints>
    )}
  </header>
);

export default EventsPageHeader;
