import { getEventListOptions } from '@asap-hub/frontend-utils';
import { EventConstraint } from '@asap-hub/model';

import { useEvents } from '../events/state';
import { usePaginationParams } from '../hooks';

export const useUpcomingAndPastEvents = (
  currentTime: Date,
  constraint: EventConstraint,
) => {
  const { pageSize } = usePaginationParams();
  const upcomingEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
      constraint,
    }),
  );

  const pastEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: true,
      pageSize,
      constraint,
    }),
  );
  return [upcomingEventsResult, pastEventsResult];
};
