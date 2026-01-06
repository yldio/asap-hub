import { FC, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { EventsPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import Frame from '../Frame';
import Calendars from './calendar/Calendars';

const loadEventDirectory = () =>
  import(/* webpackChunkName: "events-list" */ './EventDirectory');
const loadEvent = () => import(/* webpackChunkName: "event" */ './Event');

const EventsDirectory = lazy(loadEventDirectory);
const Event = lazy(loadEvent);

const Events: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadEventDirectory().then(loadEvent);
  }, []);

  const [currentTime] = useState(new Date());

  return (
    <Routes>
      <Route
        path={gp2.events({}).calendar.template}
        element={
          <EventsPage>
            <Frame title="Subscribe to Calendars">
              <Calendars />
            </Frame>
          </EventsPage>
        }
      />
      <Route
        path={gp2.events({}).upcoming.template}
        element={
          <EventsPage>
            <EventsDirectory currentTime={currentTime} paddingTop={32} />
          </EventsPage>
        }
      />
      <Route
        path={gp2.events({}).past.template}
        element={
          <EventsPage>
            <EventsDirectory past currentTime={currentTime} paddingTop={32} />
          </EventsPage>
        }
      />
      <Route
        path={gp2.events({}).event.template}
        element={
          <Frame title="Event">
            <Event />
          </Frame>
        }
      />
      <Route
        index
        element={<Navigate to={gp2.events({}).upcoming({}).$} replace />}
      />
    </Routes>
  );
};

export default Events;
