import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useFlags } from '@asap-hub/react-context';

import { gp2 } from '@asap-hub/routing';
import { EventsPage } from '@asap-hub/gp2-components';
import Calendars from './calendar/Calendars';
import Frame from '../Frame';

const loadEventDirectory = () =>
  import(/* webpackChunkName: "events-list" */ './EventDirectory');
const loadEvent = () => import(/* webpackChunkName: "event" */ './Event');

const EventsDirectory = lazy(loadEventDirectory);
const Event = lazy(loadEvent);

const Events: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadEventDirectory().then(loadEvent);
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
          <EventsDirectory currentTime={currentTime} paddingTop={32} />
        </EventsPage>
      </Route>
      <Route exact path={path + gp2.events({}).past.template}>
        <EventsPage>
          <EventsDirectory past currentTime={currentTime} paddingTop={32} />
        </EventsPage>
      </Route>
      <Route path={path + gp2.events({}).event.template}>
        <Frame title="Event">
          <Event />
        </Frame>
      </Route>
      {isEnabled('DISPLAY_EVENTS') ? (
        <Redirect to={gp2.events({}).upcoming({}).$} />
      ) : (
        <Redirect to={gp2.events({}).calendar({}).$} />
      )}
    </Switch>
  );
};

export default Events;
