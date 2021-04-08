import React from 'react';
import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { events, useRouteParams } from '@asap-hub/routing';

import { useEventById, useQuietRefreshEventById } from './state';
import { useBackHref } from '../hooks';
import Frame from '../structure/Frame';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);

  const backHref = useBackHref() ?? events({}).$;

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage {...event} backHref={backHref} onRefresh={refreshEvent} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
