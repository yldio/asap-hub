import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import {
  BasicEvent,
  eventMaterialTypes,
  EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
} from '@asap-hub/model';

import { subMinutes, parseISO } from 'date-fns';

import { ToastCard, EventInfo } from '../molecules';
import { perRem, mobileScreen } from '../pixels';
import { Link } from '../atoms';
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';

type EventCardProps = ComponentProps<typeof EventInfo> &
  Pick<
    BasicEvent,
    | 'tags'
    | 'status'
    | 'meetingLink'
    | 'hideMeetingLink'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
  > & {
    displayToast?: boolean;
    hasSpeakersToBeAnnounced: boolean;
  };

const buttonStyle = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: `${15 / perRem}em`,
    width: '100%',
  },
});

const EventCard: React.FC<EventCardProps> = ({
  status,
  eventSpeakers,
  eventTeams,
  displayToast = true,
  hasSpeakersToBeAnnounced,
  ...props
}) => {
  const considerStartedAfter = subMinutes(
    parseISO(props.startDate),
    EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
  );

  const hasStarted = useDateHasPassed(considerStartedAfter);
  const hasFinished = useDateHasPassed(considerEndedAfter(props.endDate));
  const toastCardProps = (
    shouldDisplayToast: boolean,
  ): Omit<ComponentProps<typeof ToastCard>, 'children'> => {
    if (shouldDisplayToast === false) {
      return {};
    }
    if (status === 'Cancelled') {
      return {
        toastContent: 'This event has been cancelled',
        type: 'alert',
      };
    }
    if (hasStarted && !hasFinished) {
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
              <div css={buttonStyle}>
                <Link
                  href={props.meetingLink}
                  noMargin
                  primary
                  buttonStyle
                  small
                >
                  Join meeting now
                </Link>
              </div>
            )}
          </>
        ),
      };
    }
    if (!hasStarted && hasSpeakersToBeAnnounced) {
      return {
        type: 'info',
        toastContent: 'More speakers to be announced.',
      };
    }

    if (hasFinished) {
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
    <ToastCard {...toastCardProps(displayToast)}>
      <EventInfo
        {...props}
        status={status}
        eventSpeakers={eventSpeakers}
        eventTeams={eventTeams}
      />
    </ToastCard>
  );
};

export default EventCard;
