import React, { useState, useEffect } from 'react';
import { EventsPage } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { events } from '@asap-hub/routing';

import Frame from '../structure/Frame';
import Event from './Event';

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
        <EventsPage>
          <Frame>
            <EventList currentTime={time} />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={path + events({}).past.template}>
        <EventsPage>
          <Frame>
            <EventList past currentTime={time} />
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
