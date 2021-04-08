import React, { useState, useEffect } from 'react';
import { EventsPage } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { events } from '@asap-hub/routing';

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
  const [currentTime] = useState(new Date());

  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <Switch>
      <Route exact path={path + events({}).calendar.template}>
        <EventsPage>
          <Frame title="Calendars">
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
      <Redirect to={events({}).calendar({}).$} />
    </Switch>
  );
};

export default Events;
