import React, { useState, useEffect } from 'react';
import { EventsPage } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { events } from '@asap-hub/routing';
import { useDebounce } from 'use-debounce';

import Frame from '../structure/Frame';
import Event from './Event';
import { useSearch } from '../hooks';

const loadCalendars = () =>
  import(/* webpackChunkName: "events-calendars" */ './calendar/Calendars');
const loadEventList = () =>
  import(/* webpackChunkName: "events-list" */ './EventList');

const Calendars = React.lazy(loadCalendars);
const EventList = React.lazy(loadEventList);

const Events: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadCalendars().then(loadEventList);
  }, []);

  const { path } = useRouteMatch();
  const [time] = useState(new Date());

  const { searchQuery, setSearchQuery } = useSearch();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 400);

  return (
    <Switch>
      <Route exact path={path + events({}).calendar.template}>
        <EventsPage>
          <Frame>
            <Calendars />
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={path + events({}).upcoming.template}>
        <EventsPage
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
        >
          <Frame>
            <EventList currentTime={time} searchQuery={debouncedSearchQuery} />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={path + events({}).past.template}>
        <EventsPage
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
        >
          <Frame>
            <EventList
              past
              currentTime={time}
              searchQuery={debouncedSearchQuery}
            />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={path + events({}).event.template}>
        <Frame>
          <Event />
        </Frame>
      </Route>
      <Redirect to={events({}).calendar({}).$} />
    </Switch>
  );
};

export default Events;
