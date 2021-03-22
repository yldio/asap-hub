import React, { ComponentProps } from 'react';
import { EventResponse } from '@asap-hub/model';
import { isAfter, isBefore, subMinutes } from 'date-fns';

import { ToastCard, TagList, EventInfo } from '../molecules';
import { Link } from '../atoms';

const EVENT_CONSIDERED_IN_PROGRESS_BEFORE_MINUTES: number = 5;

const materials: Array<keyof EventCardProps> = [
  'notes',
  'videoRecording',
  'presentation',
  'meetingMaterials',
];

type EventCardProps = ComponentProps<typeof EventInfo> &
  Pick<
    EventResponse,
    | 'tags'
    | 'status'
    | 'meetingLink'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
  >;
const EventCard: React.FC<EventCardProps> = ({ status, tags, ...props }) => {
  const toastCardProps = (): Omit<
    ComponentProps<typeof ToastCard>,
    'children'
  > => {
    const currentTime = new Date();
    const consideredStarted = subMinutes(
      new Date(props.startDate),
      EVENT_CONSIDERED_IN_PROGRESS_BEFORE_MINUTES,
    );
    const consideredEnded = new Date(props.endDate);
    if (status === 'Cancelled') {
      return { toastContent: 'This event has been cancelled', type: 'alert' };
    }
    if (
      isAfter(currentTime, consideredStarted) &&
      isBefore(currentTime, consideredEnded)
    ) {
      return {
        type: 'live',
        toastContent: (
          <span>
            This event is currently happening.{' '}
            {props.meetingLink && (
              <Link href={props.meetingLink}>Join the meeting now</Link>
            )}
          </span>
        ),
      };
    }
    if (isAfter(currentTime, consideredEnded)) {
      const materialCount = materials.filter((key) => {
        const value = props[key as keyof typeof props];
        return (
          (Array.isArray(value) && value.length) ||
          (!Array.isArray(value) && value)
        );
      }).length;
      if (materialCount > 0) {
        return {
          type: 'attachment',
          toastContent: `Meeting materials (${materialCount})`,
        };
      }
      if (
        materials.filter((value) => props[value as keyof typeof props] === null)
          .length === materials.length
      ) {
        return {
          type: 'attachment',
          toastContent: 'No meeting materials available',
        };
      }
      return {
        type: 'attachment',
        toastContent: 'Meeting materials coming soon…',
      };
    }
    return {};
  };

  return (
    <ToastCard {...toastCardProps()}>
      <EventInfo {...props} status={status} />
      <TagList tags={tags} max={3} />
    </ToastCard>
  );
};

export default EventCard;
