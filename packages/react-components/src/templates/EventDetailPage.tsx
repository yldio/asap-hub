/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { EventResponse, gp2 } from '@asap-hub/model';
import formatDistance from 'date-fns/formatDistance';

import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { BackLink, CtaCard } from '../molecules';
import { Card, Link, Paragraph } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import {
  EventCard,
  EventMaterials,
  JoinEvent,
  EventAbout,
  CalendarList,
  RelatedResearchCard,
  RelatedTutorialsCard,
} from '../organisms';
import { createMailTo, TECH_SUPPORT_EMAIL } from '../mail';
import { useScrollToHash } from '../routing';

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

type EventDetailPageProps<
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
> = ComponentProps<typeof EventCard> &
  ComponentProps<typeof JoinEvent> &
  ComponentProps<typeof EventAbout> &
  Pick<
    ComponentProps<typeof RelatedResearchCard>,
    'getSourceIcon' | 'tableTitles'
  > &
  Pick<EventResponse, 'lastModifiedDate' | 'calendar' | 'relatedTutorials'> & {
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
    readonly children?: ReactNode;
  };
const EventDetailPage = <
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
>({
  hasFinished,
  backHref,
  lastModifiedDate,
  calendar,
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
}: EventDetailPageProps<T>) => {
  useScrollToHash();

  return (
    <div>
      {backHref && <BackLink href={backHref} />}
      <>
        <div css={cardsStyles}>
          <EventCard {...props} titleLimit={null} />
          <Card>
            {children}
            {!props.hideMeetingLink && <JoinEvent {...props} />}
            <Paragraph accent="lead" styles={updatedParagraphStyles}>
              <small>
                Last updated:{' '}
                {formatDistance(new Date(), new Date(lastModifiedDate))} ago
              </small>
            </Paragraph>
          </Card>
          {(props.description || props.tags.length > 0) && (
            <Card>
              <EventAbout {...props} />
            </Card>
          )}
          {relatedResearch && relatedResearch.length > 0 && (
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
};

export default EventDetailPage;
