/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode } from 'react';
import { css } from '@emotion/react';
import { EventResponse, gp2 } from '@asap-hub/model';

import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { BackLink, CtaCard } from '../molecules';
import { Card, Link, Paragraph } from '../atoms';
import { rem } from '../pixels';
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
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';
import { paper, steel } from '../colors';
import PageConstraints from './PageConstraints';

const cardsStyles = css({
  display: 'grid',
  rowGap: rem(33),
  marginBottom: rem(24),
});

const heroBandStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const heroContentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: rem(12),
  paddingBottom: rem(40),
});

const backLinkContainerStyles = css({
  marginBottom: rem(56),
});

type EventDetailPageProps<
  T extends
    | EventResponse['relatedResearch']
    | gp2.OutputResponse['relatedOutputs'],
> = ComponentProps<typeof EventCard> &
  ComponentProps<typeof JoinEvent> &
  Omit<ComponentProps<typeof EventAbout>, 'variant'> &
  Pick<
    ComponentProps<typeof RelatedResearchCard>,
    'getSourceIcon' | 'tableTitles'
  > &
  Pick<EventResponse, 'calendar' | 'relatedTutorials'> & {
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
  const hasEnded = useDateHasPassed(considerEndedAfter(props.endDate));
  const finished = hasFinished ?? hasEnded;
  const displayJoinEvent = !props.hideMeetingLink && !finished;

  return (
    <article>
      <PageConstraints
        unconstrainedStyles={heroBandStyles}
        noPaddingTop
        noPaddingBottom
      >
        <div css={heroContentStyles}>
          {backHref && (
            <div css={backLinkContainerStyles}>
              <BackLink href={backHref} noPadding />
            </div>
          )}
          <EventCard {...props} titleLimit={null} />
        </div>
      </PageConstraints>
      <PageConstraints as="main">
        <div css={cardsStyles}>
          {(props.description || props.tags.length > 0) && (
            <Card>
              <EventAbout {...props} variant="expandable" />
            </Card>
          )}
          {(children || displayJoinEvent) && (
            <Card>
              {children}
              {displayJoinEvent && <JoinEvent {...props} />}
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

          {!finished && (
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
        {!finished && (
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
      </PageConstraints>
    </article>
  );
};

export default EventDetailPage;
