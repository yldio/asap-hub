import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useFlags } from '@asap-hub/react-context';

import { gp2 } from '@asap-hub/routing';
import { EventsPage } from '@asap-hub/gp2-components';
import Calendars from './calendar/Calendars';
import Frame from '../Frame';

const loadEventList = () =>
  import(/* webpackChunkName: "events-list" */ './EventsList');
const loadEvent = () => import(/* webpackChunkName: "event" */ './Event');

const EventList = lazy(loadEventList);
const Event = lazy(loadEvent);

const Events: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadEventList().then(loadEvent);
  }, []);

  const { path } = useRouteMatch();
  const [currentTime] = useState(new Date());
  const { isEnabled } = useFlags();

  return (
    <Switch>
      <Route exact path={path + gp2.events({}).calendar.template}>
        <EventsPage>
          <Frame title="Subscribe to Calendars">
            <Calendars />
          </Frame>
        </EventsPage>
      </Route>

      <Route exact path={path + gp2.events({}).upcoming.template}>
        <EventsPage>
          <Frame title="Upcoming Events">
            <EventList currentTime={currentTime} paddingTop={32} />
          </Frame>
        </EventsPage>
      </Route>
      <Route exact path={path + gp2.events({}).past.template}>
        <EventsPage>
          <Frame title="Past Events">
            <EventList past currentTime={currentTime} paddingTop={32} />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={path + gp2.events({}).event.template}>
        <Frame title="Event">
          <Event />
        </Frame>
      </Route>
      {isEnabled('ASAP_UPCOMING_EVENTS') ? (
        <Redirect to={gp2.events({}).upcoming({}).$} />
      ) : (
        <Redirect to={gp2.events({}).calendar({}).$} />
      )}
    </Switch>
  );
};

export default Events;
