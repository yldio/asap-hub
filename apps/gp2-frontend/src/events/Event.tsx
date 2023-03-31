import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';

import { EventSpeakers, EventOwner } from '@asap-hub/gp2-components';
import { useEventById } from './state';
import Frame from '../Frame';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(gp2.events({}).event);
  const event = useEventById(eventId);

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage
          {...event}
          displayCalendar={true}
          eventOwner={
            <EventOwner
              project={event.project}
              workingGroup={event.workingGroup}
            />
          }
        >
          {event.speakers.length ? (
            <EventSpeakers speakers={event.speakers} />
          ) : undefined}
        </EventPage>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
