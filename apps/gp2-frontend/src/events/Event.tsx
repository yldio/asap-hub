import { EventPage, NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';

import {
  EventSpeakers,
  EventOwner,
  getIconForDocumentType,
  getSourceIcon,
} from '@asap-hub/gp2-components';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { useEventById } from './state';
import Frame from '../Frame';

const Event: React.FC = () => {
  const { eventId } = useTypedParams(gp2.events.DEFAULT.DETAILS);
  const event = useEventById(eventId);

  if (event) {
    return (
      <Frame title={event.title}>
        <EventPage
          {...event}
          titleOutputs="Related Outputs"
          descriptionOutput="Find all outputs that contributed to this event."
          tags={event.tags.map((t) => t.name)}
          relatedResearch={event.relatedOutputs}
          relatedTutorials={[]}
          getIconForDocumentType={getIconForDocumentType}
          tableTitles={['Type of Output', 'Output Name', 'Source Type']}
          getSourceIcon={getSourceIcon}
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
