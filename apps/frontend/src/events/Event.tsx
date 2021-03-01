import React from 'react';
import { useParams } from 'react-router-dom';
import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { join } from 'path';

import { useEventById, useRefreshEventById } from './state';
import { NETWORK_PATH, EVENTS_PATH } from '../routes';
import { GROUPS_PATH } from '../network/routes';
import { useBackHref } from '../hooks';

const Event: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = useEventById(id);
  const refreshEvent = useRefreshEventById(id);

  const backHref = useBackHref() ?? EVENTS_PATH;

  if (event) {
    return (
      <EventPage
        {...event}
        groups={event.groups.map((group) => ({
          ...group,
          href: join(NETWORK_PATH, GROUPS_PATH, group.id),
        }))}
        backHref={backHref}
        onRefresh={refreshEvent}
      />
    );
  }

  return <NotFoundPage />;
};

export default Event;
