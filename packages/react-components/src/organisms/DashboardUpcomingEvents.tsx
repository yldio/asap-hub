import { css } from '@emotion/react';
import React, { ComponentProps, Fragment } from 'react';
import { Card } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import EventCard from './EventCard';
import { calendarIcon } from '../icons';

type DashboardUpcomingEventsProps = {
  upcomingEvents?: ComponentProps<typeof EventCard>[];
};

const upcomingEventsWrapper = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${24 / perRem}em`,
});

const noUpcomingEvents = css({
  display: 'flex',
  flexFlow: 'row',
  color: lead.rgb,
  gap: `${15 / perRem}em`,
});

const DashboardUpcomingEvents: React.FC<DashboardUpcomingEventsProps> = ({
  upcomingEvents,
}) => (
  <>
    {upcomingEvents ? (
      <div css={upcomingEventsWrapper}>
        {upcomingEvents.map(({ eventSpeakers, eventTeams, ...event }) => (
          <Fragment key={event.id}>
            <EventCard {...event} displayToast={false} />
          </Fragment>
        ))}
      </div>
    ) : (
      <Card>
        <div css={noUpcomingEvents}>
          {calendarIcon}
          <span>There are no upcoming events.</span>
        </div>
      </Card>
    )}
  </>
);
export default DashboardUpcomingEvents;
