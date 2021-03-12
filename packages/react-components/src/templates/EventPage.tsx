import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { EventResponse } from '@asap-hub/model';
import formatDistance from 'date-fns/formatDistance';

import { EventInfo, BackLink } from '../molecules';
import { Card, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  JoinEvent,
  EventAbout,
  RichTextCard,
  AdditionalMaterials,
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
    EventResponse,
    | 'lastModifiedDate'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
  > & {
    readonly backHref: string;
  };
const EventPage: React.FC<EventPageProps> = ({
  backHref,
  lastModifiedDate,
  notes,
  videoRecording,
  presentation,
  meetingMaterials,
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
        <JoinEvent {...props} />
        <EventAbout {...props} />
      </Card>
      <RichTextCard collapsible text={notes} title="Notes" />
      <RichTextCard text={videoRecording} title="Video recording" />
      <RichTextCard text={presentation} title="Presentation" />
      <AdditionalMaterials meetingMaterials={meetingMaterials} />
    </div>
  </div>
);

export default EventPage;
