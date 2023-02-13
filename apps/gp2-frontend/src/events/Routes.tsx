import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';

import { gp2 } from '@asap-hub/routing';
import { EventsPage } from '@asap-hub/gp2-components';

const loadEventList = () =>
  import(/* webpackChunkName: "events-list" */ './EventsList');

const EventList = lazy(loadEventList);

const Events: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadEventList();
  }, []);

  const { path } = useRouteMatch();
  const [currentTime] = useState(new Date());

  return (
    <Switch>
      <Route exact path={path + gp2.events({}).calendar.template}>
        <EventsPage>
          <Frame title="Subscribe to Calendars">
            <div>Calendars</div>
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={path + gp2.events({}).upcoming.template}>
        <EventsPage>
          <Frame title="Upcoming Events">
            <EventList currentTime={currentTime} />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={path + gp2.events({}).past.template}>
        <EventsPage>
          <Frame title="Past Events">
            <EventList past currentTime={currentTime} />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={path + gp2.events({}).event.template}>
        <Frame title="Event">
          <div>Event Detail Page</div>
        </Frame>
      </Route>
      <Redirect to={gp2.events({}).upcoming({}).$} />
    </Switch>
  );
};

export default Events;
