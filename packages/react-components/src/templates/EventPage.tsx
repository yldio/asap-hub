/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BasicEvent } from '@asap-hub/model';
import formatDistance from 'date-fns/formatDistance';

import { EventInfo, BackLink } from '../molecules';
import { Card, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  EventMaterials,
  JoinEvent,
  EventAbout,
  CalendarList,
} from '../organisms';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});
const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type EventPageProps = ComponentProps<typeof EventInfo> &
  ComponentProps<typeof JoinEvent> &
  ComponentProps<typeof EventAbout> &
  Pick<
    BasicEvent,
    | 'lastModifiedDate'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
    | 'hideMeetingLink'
    | 'calendar'
  > & {
    readonly backHref: string;
    readonly displayCalendar: boolean;
    readonly eventConversation?: ReactNode;
  };
const EventPage: React.FC<EventPageProps> = ({
  backHref,
  lastModifiedDate,
  calendar,
  hideMeetingLink,
  eventConversation,
  displayCalendar,
  children,
  ...props
}) => (
  <div
    css={({ components }) => [
      containerStyles,
      components?.EventPage?.containerStyles,
    ]}
  >
    <BackLink href={backHref} />
    <div css={cardsStyles}>
      <Card>
        <EventInfo {...props} titleLimit={null} />
        <Paragraph accent="lead">
          <small>
            Last updated:{' '}
            {formatDistance(new Date(), new Date(lastModifiedDate))} ago
          </small>
        </Paragraph>
        {children}
        {!hideMeetingLink && <JoinEvent {...props} />}
        <EventAbout {...props} />
      </Card>
      <EventMaterials {...props} />
      {eventConversation}
      {displayCalendar && (
        <CalendarList
          calendars={[calendar]}
          title="Subscribe to this event's Calendar"
        />
      )}
    </div>
  </div>
);

export default EventPage;
