import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  considerEndedAfter,
  EventConversation,
  EventOwner,
  EventPage,
  getIconForDocumentType,
  NotFoundPage,
  SpeakerList,
  useDateHasPassed,
} from '@asap-hub/react-components';
import { events, useRouteParams } from '@asap-hub/routing';

import { TagResponse } from '@asap-hub/model/src/gp2';
import { useEventById, useQuietRefreshEventById } from './state';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);
  const backHref = useBackHref() ?? events({}).$;

  const hasFinished = useDateHasPassed(
    considerEndedAfter(event?.endDate || ''),
  );

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage
          {...event}
          hasFinished={hasFinished}
          tags={event.tags.map((tag: TagResponse) => tag.name)}
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
