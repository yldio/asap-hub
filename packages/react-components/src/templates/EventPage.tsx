/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BasicEvent, EventResponse } from '@asap-hub/model';
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
  RelatedResearchCard,
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
    readonly relatedResearch?: EventResponse['relatedResearch'];
    readonly backHref?: string;
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
  relatedResearch,
  ...props
}) => (
  <div
    css={({ components }) => [
      containerStyles,
      components?.EventPage?.containerStyles,
    ]}
  >
    {backHref && <BackLink href={backHref} />}
    <div css={cardsStyles}>
      <Card>
        <EventInfo {...props} titleLimit={null} tags={[]} />
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
      {relatedResearch !== undefined && (
        <RelatedResearchCard
          description="Find out all shared research outputs that are related to this event."
          relatedResearch={relatedResearch}
        />
      )}
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
