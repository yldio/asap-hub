import { EventsPage } from '@asap-hub/react-components';
import { eventRoutes } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Frame, SearchFrame } from '@asap-hub/frontend-utils';

import { useSearch } from '../hooks';
import Event from './Event';

const loadCalendars = () =>
  import(/* webpackChunkName: "events-calendars" */ './calendar/Calendars');
const loadEventList = () =>
  import(/* webpackChunkName: "events-list" */ './EventList');

const Calendars = lazy(loadCalendars);
const EventList = lazy(loadEventList);

const Events: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadCalendars().then(loadEventList);
  }, []);

  const [currentTime] = useState(new Date());

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <Routes>
      <Route
        path={eventRoutes.DEFAULT.$.CALENDAR.relativePath}
        element={
          <EventsPage>
            <Frame title="Subscribe to Calendars">
              <Calendars currentTime={currentTime} />
            </Frame>
          </EventsPage>
        }
      />
      <Route
        path={eventRoutes.DEFAULT.$.UPCOMING.relativePath}
        element={
          <EventsPage
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          >
            <SearchFrame title="Upcoming Events">
              <EventList
                currentTime={currentTime}
                searchQuery={debouncedSearchQuery}
              />
            </SearchFrame>
          </EventsPage>
        }
      />
      <Route
        path={eventRoutes.DEFAULT.$.PAST.relativePath}
        element={
          <EventsPage
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          >
            <SearchFrame title="Past Events">
              <EventList
                past
                currentTime={currentTime}
                searchQuery={debouncedSearchQuery}
              />
            </SearchFrame>
          </EventsPage>
        }
      />
      <Route
        path={eventRoutes.DEFAULT.$.DETAILS.relativePath}
        element={
          <Frame title="Event">
            <Event />
          </Frame>
        }
      />
      <Route
        path="*"
        element={<Navigate to={eventRoutes.DEFAULT.UPCOMING.buildPath({})} />}
      />
    </Routes>
  );
};

export default Events;
