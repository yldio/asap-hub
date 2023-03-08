import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';

import { EventSpeakers } from '@asap-hub/gp2-components';
import { useEventById } from './state';

const Event: React.FC = () => {
  const { eventId } = useRouteParams(gp2.events({}).event);
  const event = useEventById(eventId);

  const backHref = useBackHref() ?? gp2.events({}).$;

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage
          {...event}
          backHref={backHref}
          displayCalendar={false}
          eventOwner={<div>GP2 Team</div>}
        >
          {event.speakers.length && <EventSpeakers speakers={event.speakers} />}
        </EventPage>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Event;
