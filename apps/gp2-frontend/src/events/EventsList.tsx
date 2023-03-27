import { getEventListOptions } from '@asap-hub/frontend-utils';
import {
  EmptyState,
  EventOwner,
  IconWithLabel,
  noEventCalendarIcon,
  speakerIcon,
} from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { EventsList, Paragraph, utils } from '@asap-hub/react-components';

import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useEvents } from './state';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
  constraint?: gp2.EventConstraint;
  paddingTop?: number;
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
  eventPage: {
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
  },
  userPage: {
    past: {
      title: 'No past events available.',
      description: 'It looks like this user hasn’t spoken at any events.',
    },
    upcoming: {
      title: 'No upcoming events available.',
      description: 'It looks like this user will not speak at any events.',
    },
  },
  projectAndWorkingGroupPage: {
    past: {
      title: 'No past events available.',
      description: 'When an event happens, it will be displayed here.',
    },
    upcoming: {
      title: 'No upcoming events available.',
      description: 'When a new event is available, it will be displayed here.',
    },
  },
};

const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  constraint,
  paddingTop = 48,
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

  let stateInformation;
  if (constraint) {
    if ('userId' in constraint) {
      stateInformation = eventEmptyStateText.userPage;
    } else {
      stateInformation = eventEmptyStateText.projectAndWorkingGroupPage;
    }
  } else {
    stateInformation = eventEmptyStateText.eventPage;
  }

  const { title, description } = past
    ? stateInformation.past
    : stateInformation.upcoming;

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
        <EmptyState
          icon={noEventCalendarIcon}
          {...{ title, description, paddingTop }}
        />
      )}
    </>
  );
};

export default EventList;
