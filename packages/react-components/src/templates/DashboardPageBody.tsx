import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import {
  network,
  news as newsRoute,
  sharedResearch,
  dashboard,
  events as eventsRoute,
} from '@asap-hub/routing';
import {
  TeamRole,
  UserResponse,
  ListResearchOutputResponse,
  NewsResponse,
  GuideDataObject,
} from '@asap-hub/model';
import {
  NewsSection,
  HelpSection,
  RemindersCard,
  DashboardUpcomingEvents,
  PastEventsDashboardCard,
  RecentSharedOutputs,
} from '../organisms';
import { rem } from '../pixels';
import { Link, Headline2, Card, Paragraph } from '../atoms';
import { DashboardRecommendedUsers, lead } from '..';
import { Accordion } from '../molecules';
import { externalLinkIcon } from '../icons';
import { isInternalLink } from '../utils';

const styles = css({
  display: 'grid',
  gridRowGap: rem(56),
  marginBottom: rem(25),
});

const infoStyles = css({
  color: lead.rgb,
  padding: `${rem(3)} 0 ${rem(24)}`,
  lineHeight: rem(24),
});

const viewAllStyles = css({
  marginTop: rem(24),
  textAlign: 'right',
});

type DashboardPageBodyProps = Pick<
  ComponentProps<typeof RemindersCard>,
  'reminders'
> &
  Pick<ComponentProps<typeof RemindersCard>, 'reminders'> &
  ComponentProps<typeof DashboardUpcomingEvents> &
  Omit<ComponentProps<typeof NewsSection>, 'title' | 'type' | 'news'> & {
    readonly userId: string;
    readonly teamId?: string;
    readonly news: ReadonlyArray<NewsResponse>;
  } & Pick<UserResponse, 'dismissedGettingStarted'> & {
    pastEvents: ComponentProps<typeof PastEventsDashboardCard>['events'];
    roles: TeamRole[];
    guides: GuideDataObject[];
    recentSharedOutputs?: ListResearchOutputResponse;
    recommendedUsers: UserResponse[];
  };

const publishRoles: TeamRole[] = ['ASAP Staff', 'Project Manager'];

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  roles,
  reminders,
  guides,
  pastEvents,
  dismissedGettingStarted,
  upcomingEvents,
  recentSharedOutputs,
  recommendedUsers,
}) => {
  const canPublish = roles.some((role) => publishRoles.includes(role));

  const guideAccordion = guides.map((guide) => ({
    icon: <></>,
    title: guide.title,
    description: guide.content.map((content) => (
      <div key={content.text}>
        <Paragraph>{content.text}</Paragraph>
        <div css={{ width: 'fit-content' }}>
          {content.linkUrl && (
            <div css={{ width: 'fit-content' }}>
              <Link buttonStyle small primary href={content.linkUrl}>
                {content.linkText}{' '}
                {!isInternalLink(content.linkUrl)[0] && externalLinkIcon}
              </Link>
            </div>
          )}
        </div>
      </div>
    )),
  }));

  return (
    <div css={styles}>
      {!dismissedGettingStarted && (
        <div>
          <Headline2 styleAsHeading={3}>Get Started with ASAP</Headline2>
          <div css={infoStyles}>
            Here’s everything you need to know to start using the Hub.
          </div>
          <Card accent="neutral200" padding={false}>
            <Accordion
              items={guideAccordion}
              info={{
                href: dashboard({}).dismissGettingStarted({}).$,
                hrefText: 'Don’t Show Again',
                text: 'Want to remove this section?',
              }}
            />
          </Card>
        </div>
      )}
      <div>
        <Headline2 styleAsHeading={3}>Reminders</Headline2>
        <div css={infoStyles}>
          We will remind you of the most important tasks you need to do.
        </div>
        <RemindersCard
          reminders={reminders}
          limit={3}
          canPublish={canPublish}
        />
      </div>
      <div>
        <Headline2 styleAsHeading={3}>Upcoming Events</Headline2>
        <div css={infoStyles}>Here are some upcoming events.</div>
        <DashboardUpcomingEvents upcomingEvents={upcomingEvents} />
        {upcomingEvents && upcomingEvents.length > 3 && (
          <p css={viewAllStyles} data-testid="view-upcoming-events">
            <Link href={eventsRoute({}).upcoming({}).$}>View All →</Link>
          </p>
        )}
      </div>
      <div>
        <Headline2 styleAsHeading={3}>Past Events</Headline2>
        <div css={infoStyles}>
          Explore previous events and learn about what was discussed.
        </div>
        <PastEventsDashboardCard events={pastEvents} />
        <p css={viewAllStyles} data-testid="view-past-events">
          <Link href={eventsRoute({}).past({}).$}>View All →</Link>
        </p>
      </div>
      <div>
        <Headline2 styleAsHeading={3}>Recent Shared Research</Headline2>
        <div css={infoStyles}>
          Explore and learn more about the latest Shared Research.
        </div>
        <RecentSharedOutputs outputs={recentSharedOutputs?.items} />
        {recentSharedOutputs && recentSharedOutputs.total > 5 && (
          <p css={viewAllStyles} data-testid="view-recent-shared-outputs">
            <Link href={sharedResearch({}).$}>View All →</Link>
          </p>
        )}
      </div>
      <div>
        <Headline2 styleAsHeading={3}>Latest Users</Headline2>
        <div css={infoStyles}>
          Explore and learn more about the latest users on the hub.
        </div>
        <DashboardRecommendedUsers recommendedUsers={recommendedUsers} />
        <p css={viewAllStyles}>
          <Link href={network({}).users({}).$}>View All →</Link>
        </p>
      </div>
      {news.length ? (
        <div>
          <NewsSection
            type="News"
            news={news}
            title="Latest News from ASAP"
            subtitle="Explore the latest shared research and learn more about them."
          />
          <p css={viewAllStyles}>
            <Link href={newsRoute({}).$}>View All →</Link>
          </p>
        </div>
      ) : null}
      <HelpSection />
    </div>
  );
};

export default DashboardPageBody;
