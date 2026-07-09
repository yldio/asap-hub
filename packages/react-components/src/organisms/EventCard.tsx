import { ComponentProps, Fragment } from 'react';
import { css } from '@emotion/react';

import {
  BasicEvent,
  eventMaterialTypes,
  EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
} from '@asap-hub/model';
import { events } from '@asap-hub/routing';

import { subMinutes, parseISO } from 'date-fns';

import { ToastCard, EventInfo } from '../molecules';
import { rem, mobileScreen } from '../pixels';
import { Link } from '../atoms';
import { tin } from '../colors';
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';
import { eventMaterialSectionIds } from './EventMaterials';

type EventCardProps = ComponentProps<typeof EventInfo> &
  Pick<
    BasicEvent,
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
    marginTop: rem(15),
    width: '100%',
  },
});

const eventMaterialLabels: Record<(typeof eventMaterialTypes)[number], string> =
  {
    notes: 'Notes',
    videoRecording: 'Recording',
    presentation: 'Presentation',
    meetingMaterials: 'Meeting Materials',
  };

const materialListStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  columnGap: rem(8),

  a: {
    color: 'inherit',
    textDecoration: 'underline',
  },
});

const unavailableMaterialStyles = css({
  color: tin.rgb,
});

const EventCard: React.FC<EventCardProps> = ({
  status,
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
        toastContent: 'The event has been cancelled.',
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
              <span>This event is happening now.</span>
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
                  Join Meeting Now
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
      const isMaterialAvailable = (
        key: (typeof eventMaterialTypes)[number],
      ): boolean => {
        const value = props[key];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      };
      if (eventMaterialTypes.some(isMaterialAvailable)) {
        const displayedMaterials = eventMaterialTypes.filter(
          (key) => key !== 'meetingMaterials' || isMaterialAvailable(key),
        );
        const eventHref = events({}).event({ eventId: props.id }).$;
        return {
          type: 'attachment',
          accent: 'neutral200',
          toastContent: (
            <span css={materialListStyles}>
              {displayedMaterials.map((key, index) => (
                <Fragment key={key}>
                  {index > 0 && <span>•</span>}
                  {isMaterialAvailable(key) ? (
                    <Link href={`${eventHref}#${eventMaterialSectionIds[key]}`}>
                      {eventMaterialLabels[key]}
                    </Link>
                  ) : (
                    <span css={unavailableMaterialStyles}>
                      {eventMaterialLabels[key]}
                    </span>
                  )}
                </Fragment>
              ))}
            </span>
          ),
        };
      }
    }
    return {};
  };

  return (
    <ToastCard {...toastCardProps(displayToast)}>
      <EventInfo {...props} status={status} />
    </ToastCard>
  );
};

export default EventCard;
