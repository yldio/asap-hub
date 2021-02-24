import React, { ComponentProps } from 'react';
import { EventResponse } from '@asap-hub/model';

import { ToastCard, TagList, EventInfo } from '../molecules';

type EventCardProps = ComponentProps<typeof EventInfo> &
  Pick<EventResponse, 'tags' | 'status'>;
const EventCard: React.FC<EventCardProps> = ({ status, tags, ...props }) => (
  <ToastCard
    toastText={
      status === 'Cancelled' ? 'This event has been cancelled' : undefined
    }
  >
    <EventInfo {...props} />
    <TagList tags={tags} max={3} />
  </ToastCard>
);

export default EventCard;
