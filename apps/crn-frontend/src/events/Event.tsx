import {
  EventConversation,
  EventOwner,
  EventPage,
  getIconForDocumentType,
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
        <EventPage
          {...event}
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
