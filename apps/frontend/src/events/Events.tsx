import React from 'react';
import { EventsPage, EventsCalendar } from '@asap-hub/react-components';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Frame from '../structure/Frame';
import Event from './Event';
import { useCalendars } from './calendar/state';

const Events: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();
  const { items } = useCalendars();
  return (
    <Switch>
      <Route exact path={path}>
        <EventsPage>
          <Frame>
            <EventsCalendar calendars={items} />
          </Frame>
        </EventsPage>
      </Route>
      <Route path={`${path}/:id`}>
        <Event />
      </Route>
    </Switch>
  );
};

export default Events;
