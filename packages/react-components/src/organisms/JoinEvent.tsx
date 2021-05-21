import { useEffect } from 'react';
import {
  MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
} from '@asap-hub/model';
import { subHours, parseISO, addSeconds, addHours, subMinutes } from 'date-fns';

import { noop } from '../utils';
import { Headline2, Paragraph, Anchor, Link } from '../atoms';
import { alertIcon } from '../icons';
import { layoutStyles } from '../text';
import { perRem, mobileScreen } from '../pixels';
import { mailToSupport } from '../mail';
import { useDateHasPassed } from '../date';

const REFRESH_INTERVAL_SECONDS = 60;

interface JoinEventProps {
  readonly meetingLink?: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly onRefresh?: () => void;
}
const JoinEvent: React.FC<JoinEventProps> = ({
  meetingLink,
  startDate,
  endDate,
  onRefresh = noop,
}) => {
  const startRefreshingAfter = subHours(
    parseISO(startDate),
    MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  );
  const considerStartedAfter = subMinutes(
    parseISO(startDate),
    EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT,
  );
  const considerEndedAfter = addHours(
    parseISO(endDate),
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  );

  const startRefreshing = useDateHasPassed(startRefreshingAfter);
  const linkMissing =
    useDateHasPassed(
      addSeconds(startRefreshingAfter, 2 * REFRESH_INTERVAL_SECONDS),
    ) && !meetingLink;
  const hasStarted = useDateHasPassed(considerStartedAfter);
  const hasEnded = useDateHasPassed(considerEndedAfter);

  useEffect(() => {
    const refreshInterval = globalThis.setInterval(() => {
      if (!meetingLink && startRefreshing && !hasEnded) {
        onRefresh();
      }
    }, REFRESH_INTERVAL_SECONDS * 1000);
    return () => {
      globalThis.clearInterval(refreshInterval);
    };
  }, [meetingLink, startRefreshing, hasEnded, onRefresh]);

  if (hasEnded) {
    return null;
  }

  return (
    <section>
      <Headline2 styleAsHeading={4}>Join this event</Headline2>
      <Paragraph>
        {hasStarted ? (
          'This event is currently happening.'
        ) : (
          <>
            The link will be available{' '}
            <strong>
              {MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT} hour
              {MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT === 1 ? '' : 's'}
            </strong>{' '}
            before the event begins.
          </>
        )}
        <br />
        <Link buttonStyle primary enabled={!!meetingLink} href={meetingLink}>
          Join the meeting now
        </Link>
      </Paragraph>
      {linkMissing && (
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'max-content auto',
            columnGap: `${12 / perRem}em`,
          }}
        >
          <div css={layoutStyles}>{alertIcon}</div>
          <Paragraph accent="ember">
            We’re sorry but we couldn’t find the link to this event.{' '}
            <br
              css={{
                [`@media (max-width: ${mobileScreen.max}px)`]: {
                  display: 'none',
                },
              }}
            />
            Please{' '}
            <Anchor href={mailToSupport()}>
              <span css={{ textDecoration: 'underline' }}>contact ASAP</span>
            </Anchor>{' '}
            for more information.
          </Paragraph>
        </div>
      )}
    </section>
  );
};

export default JoinEvent;
