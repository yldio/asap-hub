import {
  EventConversation,
  EventDetailPage,
  eventMapper,
  EventOwner,
  EventPage,
  getIconForDocumentType,
  NotFoundPage,
  SpeakerList,
  useDateHasPassed,
  considerEndedAfter,
  PageConstraints,
} from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import { events, useRouteParams } from '@asap-hub/routing';
import { Frame, useBackHref } from '@asap-hub/frontend-utils';

import { useEventById, useQuietRefreshEventById } from './state';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(events({}).event);
  const event = useEventById(eventId);
  const refreshEvent = useQuietRefreshEventById(eventId);
  const backHref = useBackHref() ?? events({}).$;
  const { isEnabled } = useFlags();

  const hasFinished = useDateHasPassed(
    considerEndedAfter(event?.endDate || ''),
  );

  if (event) {
    const displayCalendar =
      event.interestGroup === undefined || event.interestGroup.active;

    if (isEnabled('NEW_EVENT_PAGE')) {
      return (
        <Frame title={event.title}>
          <PageConstraints>
            <EventDetailPage
              {...eventMapper(event)}
              hasFinished={hasFinished}
              backHref={backHref}
              onRefresh={refreshEvent}
              getIconForDocumentType={getIconForDocumentType}
              displayCalendar={displayCalendar}
              eventConversation={<EventConversation {...event} />}
            >
              {!!event.speakers.length && <SpeakerList {...event} />}
            </EventDetailPage>
          </PageConstraints>
        </Frame>
      );
    }

    return (
      <Frame title={event.title}>
        <PageConstraints>
          <EventPage
            {...event}
            hasFinished={hasFinished}
            tags={event.tags.map((tag) => tag.name)}
            backHref={backHref}
            onRefresh={refreshEvent}
            getIconForDocumentType={getIconForDocumentType}
            displayCalendar={displayCalendar}
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
        </PageConstraints>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
