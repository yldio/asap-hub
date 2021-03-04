import React, { useState, useEffect } from 'react';
import { EventsPage } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import Frame from '../structure/Frame';
import Event from './Event';
import {
  EVENTS_UPCOMING_PATH,
  EVENTS_CALENDAR_PATH,
  EVENTS_PAST_PATH,
} from './routes';

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
  const calendarHref = `${path}/${EVENTS_CALENDAR_PATH}`;
  const upcomingHref = `${path}/${EVENTS_UPCOMING_PATH}`;
  const pastHref = `${path}/${EVENTS_PAST_PATH}`;
  const [time] = useState(new Date());

  return (
    <Switch>
      <Route exact path={calendarHref}>
        <EventsPage
          calendarHref={calendarHref}
          upcomingHref={upcomingHref}
          pastHref={pastHref}
        >
          <Frame>
            <Calendars />
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={upcomingHref}>
        <EventsPage
          calendarHref={calendarHref}
          upcomingHref={upcomingHref}
          pastHref={pastHref}
        >
          <Frame>
            <EventList currentTime={time} />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={pastHref}>
        <EventsPage
          calendarHref={calendarHref}
          upcomingHref={upcomingHref}
          pastHref={pastHref}
        >
          <Frame>
            <EventList past currentTime={time} />
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
