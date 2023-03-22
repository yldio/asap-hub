import { getEventListOptions } from '@asap-hub/frontend-utils';
import {
  EmptyState,
  EventOwner,
  IconWithLabel,
  noEventCalendarIcon,
  speakerIcon,
} from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import {
  EventsList,
  Paragraph,
  pixels,
  utils,
} from '@asap-hub/react-components';

import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useEvents } from './state';

const { rem } = pixels;

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
  constraint?: gp2.EventConstraint;
};

export const eventMapper = ({
  speakers,
  project,
  workingGroup,
  ...event
}: gp2.EventResponse) => ({
  ...event,
  hasSpeakersToBeAnnounced: speakers.length === 0,
  eventSpeakers: (
    <IconWithLabel icon={speakerIcon}>
      <Paragraph noMargin accent="lead">
        {utils.getCounterString(speakers.length, 'Speaker')}
      </Paragraph>
    </IconWithLabel>
  ),
  eventOwner: <EventOwner project={project} workingGroup={workingGroup} />,
});

const eventEmptyStateText = {
  past: {
    title: 'No past events available.',
    description:
      'When a working group, project or GP2 hub event finishes, it will be displayed here.',
  },
  upcoming: {
    title: 'No upcoming events available.',
    description:
      'When a working group, project or the GP2 hub creates an event it will be listed here.',
  },
};

const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  constraint,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useEvents(
    getEventListOptions<gp2.EventConstraint>(currentTime, {
      past,
      currentPage,
      pageSize,
      constraint,
    }),
  );

  const { title, description } = past
    ? eventEmptyStateText.past
    : eventEmptyStateText.upcoming;

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <>
      {total ? (
        <EventsList
          currentPageIndex={currentPage}
          numberOfItems={total}
          renderPageHref={renderPageHref}
          numberOfPages={numberOfPages}
          events={items.map(eventMapper)}
        />
      ) : (
        <div style={{ marginTop: rem(32) }}>
          <EmptyState icon={noEventCalendarIcon} {...{ title, description }} />
        </div>
      )}
    </>
  );
};

export default EventList;
