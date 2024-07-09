/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BasicEvent, EventResponse, gp2 } from '@asap-hub/model';
import formatDistance from 'date-fns/formatDistance';

import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { EventInfo, BackLink, CtaCard } from '../molecules';
import { Card, Link, Paragraph } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  EventMaterials,
  JoinEvent,
  EventAbout,
  CalendarList,
  RelatedResearchCard,
  RelatedTutorialsCard,
} from '../organisms';
import { createMailTo, TECH_SUPPORT_EMAIL } from '../mail';

const containerStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)}`,
});
const cardsStyles = css({
  display: 'grid',
  rowGap: rem(33),
  marginBottom: rem(24),
});
const updatedParagraphStyles = css({
  display: 'flex',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    justifyContent: 'end',
  },
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
    readonly hasFinished?: boolean;
  };
const EventPage = <
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
>({
  hasFinished,
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
}: React.PropsWithChildren<EventPageProps<T>>) => (
  <div
    css={({ components }) => [
      containerStyles,
      components?.EventPage?.containerStyles,
    ]}
  >
    {backHref && <BackLink href={backHref} />}
    <>
      <div css={cardsStyles}>
        <Card>
          <EventInfo {...props} titleLimit={null} tags={[]} />
          <Paragraph accent="lead" styles={updatedParagraphStyles}>
            <small>
              Last updated:{' '}
              {formatDistance(new Date(), new Date(lastModifiedDate))} ago
            </small>
          </Paragraph>
          {children}
          {!hideMeetingLink && <JoinEvent {...props} />}
          <EventAbout {...props} />
        </Card>
        {relatedResearch && relatedResearch?.length > 0 && (
          <RelatedResearchCard
            title={titleOutputs}
            description={descriptionOutput || 'Find all related research.'}
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
        <EventMaterials {...props} />
        {eventConversation}
        {displayCalendar && (
          <CalendarList
            calendars={[calendar]}
            title="Subscribe to this event's Calendar"
            hideSupportText
          />
        )}

        {!hasFinished && (
          <CtaCard
            href={createMailTo(TECH_SUPPORT_EMAIL)}
            buttonText="Contact tech support"
            displayCopy
          >
            <strong>Having trouble accessing this event?</strong>
            <br /> The tech support team is here to help.
          </CtaCard>
        )}
      </div>
      {!hasFinished && (
        <Paragraph noMargin accent="lead">
          Having issues? Set up your calendar manually with these instructions
          for{' '}
          <Link href="https://support.apple.com/en-us/guide/calendar/icl1022/mac">
            Apple Calendar
          </Link>{' '}
          or{' '}
          <Link href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c">
            Outlook
          </Link>
          .
        </Paragraph>
      )}
    </>
  </div>
);

export default EventPage;
