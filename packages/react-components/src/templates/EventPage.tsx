/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BasicEvent, EventResponse, gp2 } from '@asap-hub/model';
import formatDistance from 'date-fns/formatDistance';

import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
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
  RelatedTutorialsCard,
} from '../organisms';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});
const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type EventPageProps<
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
> = ComponentProps<typeof EventInfo> &
  ComponentProps<typeof JoinEvent> &
  ComponentProps<typeof EventAbout> &
  Pick<
    ComponentProps<typeof RelatedResearchCard>,
    'getSourceIcon' | 'tableTitles'
  > &
  Pick<
    BasicEvent,
    | 'lastModifiedDate'
    | 'notes'
    | 'videoRecording'
    | 'presentation'
    | 'meetingMaterials'
    | 'hideMeetingLink'
    | 'calendar'
  > &
  Pick<EventResponse, 'relatedTutorials'> & {
    readonly relatedResearch?: T;
    readonly backHref?: string;
    readonly displayCalendar: boolean;
    readonly eventConversation?: ReactNode;
    readonly titleOutputs?: string;
    readonly descriptionOutput?: string;
    readonly getIconForDocumentType: (
      documentType: T[number]['documentType'],
    ) => EmotionJSX.Element;
  };
const EventPage = <
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
>({
  backHref,
  lastModifiedDate,
  calendar,
  hideMeetingLink,
  eventConversation,
  displayCalendar,
  children,
  relatedTutorials,
  relatedResearch,
  titleOutputs,
  descriptionOutput,
  getIconForDocumentType,
  getSourceIcon,
  tableTitles,
  ...props
}: EventPageProps<T>) => (
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
      {relatedResearch && relatedResearch?.length > 0 && (
        <RelatedResearchCard
          title={titleOutputs}
          description={
            descriptionOutput ||
            'Find out all shared research outputs that are related to this event.'
          }
          relatedResearch={relatedResearch}
          getIconForDocumentType={getIconForDocumentType}
          getSourceIcon={getSourceIcon}
          tableTitles={tableTitles}
        />
      )}
      {relatedTutorials && relatedTutorials.length > 0 && (
        <RelatedTutorialsCard
          relatedTutorials={relatedTutorials}
          truncateFrom={3}
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
