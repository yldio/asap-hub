import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import {
  discover,
  network,
  news as newsRoute,
  sharedResearch,
  dashboard,
  events as eventsRoute,
} from '@asap-hub/routing';
import {
  TeamRole,
  UserResponse,
  ListEventResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import {
  NewsSection,
  HelpSection,
  RemindersCard,
  DashboardUpcomingEvents,
  PastEventsDashboardCard,
  RecentSharedOutputs,
} from '../organisms';
import { perRem } from '../pixels';
import { Card, Paragraph, Link, Headline2 } from '../atoms';
import { lead } from '..';
import { Accordion } from '../molecules';
import { confidentialIcon, giftIcon, learnIcon } from '../icons';

const styles = css({
  display: 'grid',
  gridRowGap: `${56 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const containerStyles = css({
  marginTop: `${24 / perRem}em`,
});

const listStyles = css({
  paddingLeft: `${18 / perRem}em`,
});

const infoStyles = css({
  color: lead.rgb,
  padding: `${3 / perRem}em 0 ${24 / perRem}em`,
  lineHeight: `${24 / perRem} em`,
});

const viewAllStyles = css({
  marginTop: `${24 / perRem}em`,
  textAlign: 'right',
});

type DashboardPageBodyProps = Pick<
  ComponentProps<typeof RemindersCard>,
  'reminders'
> &
  Pick<ComponentProps<typeof RemindersCard>, 'reminders'> &
  Omit<ComponentProps<typeof NewsSection>, 'title'> & {
    readonly userId: string;
    readonly teamId?: string;
  } & Pick<UserResponse, 'dismissedGettingStarted'> & {
    pastEvents: ComponentProps<typeof PastEventsDashboardCard>['events'];
    roles: TeamRole[];
  } & {
    upcomingEvents?: ListEventResponse;
    recentSharedOutputs?: ListResearchOutputResponse;
  };

const publishRoles: TeamRole[] = ['ASAP Staff', 'Project Manager'];

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  userId,
  teamId,
  roles,
  reminders,
  pastEvents,
  dismissedGettingStarted,
  upcomingEvents,
  recentSharedOutputs,
}) => {
  const canPublish = roles.some((role) => publishRoles.includes(role));

  return (
    <div css={styles}>
      {!dismissedGettingStarted && (
        <div>
          <Headline2 styleAsHeading={3}>Get Started with ASAP</Headline2>
          <div css={infoStyles}>
            Here’s everything you need to know to start using the Hub.
          </div>
          <Accordion
            items={[
              {
                icon: learnIcon,
                title: 'How to use the Hub?',
                description:
                  'Explore a series of short videos that highlight the many different aspects of the Hub.',
                hrefText: 'Explore videos',
                href: 'https://hub.asap.science/news/f247813e-a64c-4909-8071-11ae9896c52a',
              },
              {
                icon: giftIcon,
                title: 'Grant Welcome Packet',
                description:
                  'All you need to know about the Network, the Hub, sharing, meetings, communications, publishing and more.',
                hrefText: 'Open the packet',
                href: 'https://drive.google.com/file/d/1E-wPBbVQnVHpBBP24pgIo87AOVoO15Gr/view',
              },
              {
                icon: confidentialIcon,
                title: 'Confidentiality Rules',
                description:
                  'View all confidentiality rules related to the Hub.',
                hrefText: 'Read more',
                href: 'https://hub.asap.science/terms-and-conditions',
              },
            ]}
            info={{
              href: dashboard({}).dismissGettingStarted({}).$,
              hrefText: 'Don’t Show Again',
              text: 'Want to remove this section?',
            }}
          />
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
        {upcomingEvents && upcomingEvents.total > 3 && (
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
      {news.length ? (
        <div>
          <NewsSection
            news={[news[0]]}
            title="Latest News from ASAP"
            subtitle="Explore the latest shared research and learn more about them."
          />
          <p css={viewAllStyles} data-testid="view-news">
            <Link href={newsRoute({}).$}>View All →</Link>
          </p>
        </div>
      ) : null}
      <section>
        <Headline2 styleAsHeading={3}>You may want to try</Headline2>
        <div css={containerStyles}>
          <Card>
            <ul css={listStyles}>
              <li>
                <Paragraph primary accent="lead">
                  Check out grantee profiles and team pages in the{' '}
                  <Link href={network({}).users({}).$}>Network</Link>
                </Paragraph>
              </li>
              <li>
                <Paragraph primary accent="lead">
                  Read team proposals in{' '}
                  <Link href={sharedResearch({}).$}>Shared Research</Link>
                </Paragraph>
              </li>
              <li>
                <Paragraph primary accent="lead">
                  Meet the ASAP team in{' '}
                  <Link href={discover({}).$}>Discover ASAP</Link>
                </Paragraph>
              </li>
              <li>
                <Paragraph primary accent="lead">
                  Stay up date with <Link href={newsRoute({}).$}>News</Link>
                </Paragraph>
              </li>
              {teamId ? (
                <li>
                  <Paragraph primary accent="lead">
                    Add important links to your private{' '}
                    <Link
                      href={
                        network({}).teams({}).team({ teamId }).workspace({}).$
                      }
                    >
                      Team Workspace
                    </Link>
                  </Paragraph>
                </li>
              ) : null}
              <li>
                <Paragraph primary accent="lead">
                  View and edit your own{' '}
                  <Link href={network({}).users({}).user({ userId }).$}>
                    Profile
                  </Link>
                </Paragraph>
              </li>
            </ul>
          </Card>
        </div>
      </section>
      <HelpSection />
    </div>
  );
};

export default DashboardPageBody;
