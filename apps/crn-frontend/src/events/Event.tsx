import {
  EventConversation,
  EventOwner,
  EventPage,
  getIconForDocumentType,
  NotFoundPage,
  SpeakerList,
  useDateHasPassed,
  considerEndedAfter,
} from '@asap-hub/react-components';
import { eventRoutes } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';

import { useEventById, useQuietRefreshEventById } from './state';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

const Event: React.FC = () => {
  const { eventId } = useTypedParams(eventRoutes.DEFAULT.DETAILS);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);

  const backHref = useBackHref() ?? eventRoutes.DEFAULT.path;

  const hasFinished = useDateHasPassed(
    considerEndedAfter(event?.endDate || ''),
  );

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage
          {...event}
          hasFinished={hasFinished}
          tags={event.tags.map((tag) => tag.name)}
          backHref={backHref}
          onRefresh={refreshEvent}
          getIconForDocumentType={getIconForDocumentType}
          displayCalendar={
            event.interestGroup === undefined || event.interestGroup.active
          }
          eventConversation={<EventConversation {...event} />}
          eventOwner={
            <EventOwner
              interestGroup={event.interestGroup}
              workingGroup={event.workingGroup}
            />
          }
        >
          {!!event.speakers.length && <SpeakerList {...event} />}
        </EventPage>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
