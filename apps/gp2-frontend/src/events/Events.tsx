import { EventsPage } from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';

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
    loadCalendars().then(loadEventList);
  }, []);

  const { path } = useRouteMatch();
  const [currentTime] = useState(new Date());

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <Switch>
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
          <Frame title="Upcoming Events">
            <EventList
              currentTime={currentTime}
              searchQuery={debouncedSearchQuery}
            />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={path + events({}).past.template}>
        <EventsPage
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
        >
          <Frame title="Past Events">
            <EventList
              past
              currentTime={currentTime}
              searchQuery={debouncedSearchQuery}
            />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={path + events({}).event.template}>
        <Frame title="Event">
          <Event />
        </Frame>
      </Route>
      <Redirect to={events({}).upcoming({}).$} />
    </Switch>
  );
};

export default Events;
