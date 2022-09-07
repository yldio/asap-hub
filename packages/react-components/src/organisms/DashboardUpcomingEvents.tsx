import { EventResponse } from '@asap-hub/model';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import { Card, Headline2, Link } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import EventCard from './EventCard';
import { calendarIcon } from '../icons';

type DashboardUpcomingEventsProps = {
  upcomingEvents?: EventResponse[];
  upcomingEventsCount?: number;
};

const infoStyles = css({
  color: lead.rgb,
  padding: `${3 / perRem}em 0 ${24 / perRem}em`,
  lineHeight: `${24 / perRem} em`,
});

const upcomingEventsWrapper = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${24 / perRem}em`,
});

const viewallLink = css({
  display: 'flex',
  flexFlow: 'row-reverse',
});

const noUpcomingEvents = css({
  display: 'flex',
  flexFlow: 'row',
  color: lead.rgb,
  gap: `${15 / perRem}em`,
});

const MAX_ALLOWED_EVENTS = 3;

const DashboardUpcomingEvents: React.FC<DashboardUpcomingEventsProps> = ({
  upcomingEvents,
  upcomingEventsCount = 0,
}) => {
  const trimmedUpcomingEvents =
    upcomingEvents && upcomingEvents.length > MAX_ALLOWED_EVENTS
      ? upcomingEvents?.slice(0, MAX_ALLOWED_EVENTS)
      : upcomingEvents;

  return (
    <div>
      <div>
        <Headline2 styleAsHeading={3}>Upcoming Events</Headline2>
        <div css={infoStyles}>Here're some upcoming events.</div>
      </div>
      <div>
        {trimmedUpcomingEvents ? (
          <div css={upcomingEventsWrapper}>
            {trimmedUpcomingEvents.map((event) => (
              <Fragment key={event.id}>
                <EventCard
                  {...event}
                  showNumberOfSpeakers={false}
                  showTeams={false}
                  displayToast={false}
                />
              </Fragment>
            ))}
            {upcomingEventsCount > MAX_ALLOWED_EVENTS && (
              <div css={viewallLink}>
                <Link href={events({}).upcoming({}).$}>View All →</Link>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <div css={noUpcomingEvents}>
              {calendarIcon}
              <span>There are no upcoming events.</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export default DashboardUpcomingEvents;
