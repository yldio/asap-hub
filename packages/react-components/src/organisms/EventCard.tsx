import { ComponentProps } from 'react';
import {
  eventMaterialTypes,
  EventResponse,
  EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
} from '@asap-hub/model';

import { subMinutes, parseISO } from 'date-fns';

import { ToastCard, EventInfo } from '../molecules';
import { Link } from '../atoms';
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';

type EventCardProps = ComponentProps<typeof EventInfo> &
  Pick<
    EventResponse,
    | 'tags'
    | 'status'
    | 'meetingLink'
    | 'hideMeetingLink'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
  >;

const EventCard: React.FC<EventCardProps> = ({
  status,
  speakers,
  ...props
}) => {
  const considerStartedAfter = subMinutes(
    parseISO(props.startDate),
    EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
  );

  const started = useDateHasPassed(considerStartedAfter);
  const finished = useDateHasPassed(considerEndedAfter(props.endDate));
  const toastCardProps = (): Omit<
    ComponentProps<typeof ToastCard>,
    'children'
  > => {
    if (status === 'Cancelled') {
      return {
        toastContent: 'This event has been cancelled',
        type: 'alert',
      };
    }
    if (started && !finished) {
      return {
        type: 'live',
        toastContent: (
          <>
            {props.hideMeetingLink || !props.meetingLink ? (
              <span>This in-person event is currently happening.</span>
            ) : (
              <span>This event is currently live.</span>
            )}
          </>
        ),
        toastAction: (
          <>
            {props.meetingLink && !props.hideMeetingLink && (
              <Link
                href={props.meetingLink}
                margin={false}
                primary
                buttonStyle
                small
              >
                Join meeting now
              </Link>
            )}
          </>
        ),
      };
    }
    if (speakers.length === 0) {
      return {
        type: 'info',
        toastContent: 'More speakers to be announced.',
      };
    }

    if (finished) {
      const materialCount = eventMaterialTypes.reduce((count, key) => {
        const value = props[key];
        if (Array.isArray(value)) {
          return count + value.length;
        }
        if (value) {
          return count + 1;
        }
        return count;
      }, 0);
      if (materialCount > 0) {
        return {
          type: 'attachment',
          toastContent: `Meeting materials (${materialCount})`,
        };
      }
      if (eventMaterialTypes.every((value) => props[value] === null)) {
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
      <EventInfo
        {...props}
        status={status}
        speakers={speakers}
        showNumberOfSpeakers={true}
        showTeams={true}
      />
    </ToastCard>
  );
};

export default EventCard;
