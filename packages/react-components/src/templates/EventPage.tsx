import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { EventResponse } from '@asap-hub/model';
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
  EventConversation,
} from '../organisms';
import SpeakerList from '../organisms/SpeakersList';

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
  ComponentProps<typeof SpeakerList> &
  Pick<
    EventResponse,
    | 'lastModifiedDate'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
    | 'hideMeetingLink'
    | 'calendar'
    | 'group'
  > & {
    readonly backHref: string;
  };
const EventPage: React.FC<EventPageProps> = ({
  backHref,
  lastModifiedDate,
  calendar,
  hideMeetingLink,
  ...props
}) => (
  <div css={containerStyles}>
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
        {props.speakers.length && <SpeakerList {...props} />}
        {!hideMeetingLink && <JoinEvent {...props} />}
        <EventAbout {...props} />
      </Card>
      <EventMaterials {...props} />
      <EventConversation {...props} />
      {(props.group === undefined || props.group.active) && (
        <CalendarList page="event" calendars={[calendar]} />
      )}
    </div>
  </div>
);

export default EventPage;
