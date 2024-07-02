import { useFlags } from '@asap-hub/react-context';
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

  // const { pathname: path } = useLocation();
  const [currentTime] = useState(new Date());
  const { isEnabled } = useFlags();

  return (
    <Routes>
      <Route
        path={gp2.events.DEFAULT.$.CALENDAR.relativePath}
        element={
          <EventsPage>
            <Frame title="Subscribe to Calendars">
              <Calendars />
            </Frame>
          </EventsPage>
        }
      />
      <Route
        path={gp2.events.DEFAULT.$.UPCOMING.relativePath}
        element={
          <EventsPage>
            <EventsDirectory currentTime={currentTime} paddingTop={32} />
          </EventsPage>
        }
      />
      <Route
        path={gp2.events.DEFAULT.$.PAST.relativePath}
        element={
          <EventsPage>
            <EventsDirectory past currentTime={currentTime} paddingTop={32} />
          </EventsPage>
        }
      />
      <Route
        path={gp2.events.DEFAULT.$.DETAILS.relativePath}
        element={
          <Frame title="Event">
            <Event />
          </Frame>
        }
      />
      {isEnabled('DISPLAY_EVENTS') ? (
        <Route
          path="*"
          element={<Navigate to={gp2.events.DEFAULT.$.UPCOMING.relativePath} />}
        />
      ) : (
        <Route
          path="*"
          element={<Navigate to={gp2.events.DEFAULT.$.CALENDAR.relativePath} />}
        />
      )}
    </Routes>
  );
};

export default Events;
