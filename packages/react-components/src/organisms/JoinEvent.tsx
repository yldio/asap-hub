import React, { useEffect, useState } from 'react';
import {
  MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
import { subHours, parseISO, isAfter, addSeconds, addHours } from 'date-fns';

import { noop } from '../utils';
import { Headline2, Paragraph, Anchor, Link } from '../atoms';
import { alertIcon } from '../icons';
import { layoutStyles } from '../text';
import { perRem } from '../pixels';
import { mailToSupport } from '../mail';

const REFRESH_INTERVAL_SECONDS = 60;
const UPDATE_INTERVAL_SECONDS = 10;

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
  const [linkMissing, setLinkMissing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const startRefreshingAfter = subHours(
    parseISO(startDate),
    MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  );
  const considerStartedAfter = parseISO(startDate);
  const considerEndedAfter = addHours(
    parseISO(endDate),
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  );

  useEffect(() => {
    const update = () => {
      setLinkMissing(
        !meetingLink &&
          isAfter(
            new Date(),
            // two refresh durations tolerance to not show an error message straight away in case of unsynced time, or a pending refresh
            addSeconds(startRefreshingAfter, 2 * REFRESH_INTERVAL_SECONDS),
          ),
      );
      setHasStarted(isAfter(new Date(), considerStartedAfter));
      setHasEnded(isAfter(new Date(), considerEndedAfter));
    };
    update();
    const updateInterval = globalThis.setInterval(() => {
      update();
    }, UPDATE_INTERVAL_SECONDS);
    return () => globalThis.clearInterval(updateInterval);
  }, [
    startRefreshingAfter,
    considerStartedAfter,
    considerEndedAfter,
    meetingLink,
  ]);

  useEffect(() => {
    const refreshInterval = globalThis.setInterval(() => {
      if (!meetingLink && isAfter(new Date(), startRefreshingAfter)) {
        onRefresh();
      }
    }, REFRESH_INTERVAL_SECONDS * 1000);
    return () => {
      globalThis.clearInterval(refreshInterval);
    };
  }, [startRefreshingAfter, meetingLink, onRefresh]);

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
            We’re sorry but we couldn’t find the link to this event.
            <br />
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
