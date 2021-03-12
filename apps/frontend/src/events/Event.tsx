import React from 'react';
import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { events, useRouteParams } from '@asap-hub/routing';

import { useEventById, useRefreshEventById } from './state';
import { useBackHref } from '../hooks';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useRefreshEventById(eventId);

  const backHref = useBackHref() ?? events({}).$;

  if (event) {
    return (
      <EventPage
        {...event}
        groups={event.groups}
        backHref={backHref}
        onRefresh={refreshEvent}
      />
    );
  }

  return <NotFoundPage />;
};

export default Event;
