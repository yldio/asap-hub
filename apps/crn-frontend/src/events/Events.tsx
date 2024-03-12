import { EventsPage } from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Routes, useRouteMatch } from 'react-router-dom';
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

  const { path } = useRouteMatch();
  const [currentTime] = useState(new Date());

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <Routes>
      <Route exact path={path + events({}).calendar.template}>
        <EventsPage>
          <Frame title="Subscribe to Calendars">
            <Calendars currentTime={currentTime} />
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={path + events({}).upcoming.template}>
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
      </Route>
      <Route exact path={path + events({}).past.template}>
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
      </Route>
      <Route path={path + events({}).event.template}>
        <Frame title="Event">
          <Event />
        </Frame>
      </Route>
      <Redirect to={events({}).upcoming({}).$} />
    </Routes>
  );
};

export default Events;
