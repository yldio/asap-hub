import {
  EventPage,
  NotFoundPage,
  SpeakerList,
} from '@asap-hub/react-components';
import { events, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';

import { useEventById, useQuietRefreshEventById } from './state';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);
  const backHref = useBackHref() ?? events({}).$;

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage {...event} backHref={backHref} onRefresh={refreshEvent}>
          {!!event.speakers.length && <SpeakerList {...event} />}
        </EventPage>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
