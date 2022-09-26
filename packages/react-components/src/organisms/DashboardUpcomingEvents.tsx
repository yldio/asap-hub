import { ListEventResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import { Card } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import EventCard from './EventCard';
import { calendarIcon } from '../icons';

type DashboardUpcomingEventsProps = {
  upcomingEvents?: ListEventResponse;
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
    {upcomingEvents?.items ? (
      <div css={upcomingEventsWrapper}>
        {upcomingEvents.items.map((event) => (
          <Fragment key={event.id}>
            <EventCard
              {...event}
              showNumberOfSpeakers={false}
              showTeams={false}
              displayToast={false}
            />
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
