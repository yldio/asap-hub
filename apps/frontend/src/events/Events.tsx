import React, { useState, useEffect } from 'react';
import { EventsPage } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import Frame from '../structure/Frame';
import Event from './Event';
import { EVENTS_UPCOMING_PATH, EVENTS_CALENDAR_PATH } from './routes';

const loadCalendars = () =>
  import(/* webpackChunkName: "events-calendars" */ './calendar/Calendars');
const loadUpcoming = () =>
  import(/* webpackChunkName: "events-upcoming" */ './Upcoming');

const Calendars = React.lazy(loadCalendars);
const Upcoming = React.lazy(loadUpcoming);

const Events: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadCalendars().then(loadUpcoming);
  }, []);
  const { path } = useRouteMatch();
  const calendarHref = `${path}/${EVENTS_CALENDAR_PATH}`;
  const upcomingHref = `${path}/${EVENTS_UPCOMING_PATH}`;
  const [time] = useState(new Date());

  return (
    <Switch>
      <Route exact path={calendarHref}>
        <EventsPage calendarHref={calendarHref} upcomingHref={upcomingHref}>
          <Frame>
            <Calendars />
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={upcomingHref}>
        <EventsPage calendarHref={calendarHref} upcomingHref={upcomingHref}>
          <Frame>
            <Upcoming currentTime={time} />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={`${path}/:id`}>
        <Frame>
          <Event />
        </Frame>
      </Route>
      <Redirect to={calendarHref} />
    </Switch>
  );
};

export default Events;
