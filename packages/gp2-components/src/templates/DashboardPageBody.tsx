import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routes } from '@asap-hub/routing';
import {
  Accordion,
  Button,
  Card,
  DashboardUpcomingEvents,
  EventCard,
  Headline2,
  LabIcon,
  lead,
  WorkingGroupsIcon,
  Link,
  Paragraph,
  pixels,
  RemindersCard,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useFlags } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { ArticleIcon } from '../icons';
import { mobileQuery } from '../layout';
import GuideDescription from '../molecules/GuideDescription';
import { NewsItem } from '../molecules';
import InfoCard from '../molecules/InfoCard';
import { DashboardUserCard } from '../organisms';

const { rem } = pixels;
const infoStyles = css({
  color: lead.rgb,
  padding: `${rem(3)} 0 ${rem(24)}`,
  lineHeight: rem(24),
});

const viewAllStyles = css({
  marginTop: rem(24),
  textAlign: 'center',
});

const columnContainer = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
});

const contentCardsStyles = css({
  display: 'flex',
  gap: rem(24),
  width: '100%',
  justifyContent: 'center',
  justifyItems: 'center',
  marginTop: rem(32),
  [mobileQuery]: {
    flexDirection: 'column',
  },
});

const usersCardsStyles = css({
  display: 'flex',
  gap: rem(15),
  width: '100%',
  justifyContent: 'center',
  justifyItems: 'center',
  marginTop: rem(24),
  [mobileQuery]: {
    flexDirection: 'column',
  },
});

type DashboardPageBodyProps = {
  news: gp2Model.ListNewsResponse;
  latestStats: gp2Model.StatsDataObject;
  totalOfUpcomingEvents: number;
  announcements?: ComponentProps<typeof RemindersCard>['reminders'];
  upcomingEvents: ComponentProps<typeof EventCard>[];
  guides?: gp2Model.GuideDataObject[];
  latestUsers: gp2Model.UserResponse[];
};

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  latestStats,
  totalOfUpcomingEvents,
  announcements,
  upcomingEvents,
  guides,
  latestUsers,
}) => {
  const { isEnabled } = useFlags();
  const history = useHistory();
  const lastestNews = news.items[0];
  return (
    <>
      {announcements ? (
        <div css={columnContainer}>
          <Headline2>Announcements</Headline2>
          <Paragraph accent="lead" noMargin>
            Here are the latest announcements from admins.
          </Paragraph>
          <div css={contentCardsStyles}>
            <RemindersCard limit={3} reminders={announcements} canPublish />
          </div>
        </div>
      ) : null}
      <div css={columnContainer}>
        <Headline2>GP2 Hub Stats</Headline2>
        <Paragraph accent="lead" noMargin>
          Here are the latest stats from the GP2 Hub.
        </Paragraph>
        <div css={contentCardsStyles}>
          <InfoCard
            icon={<LabIcon color="#00202C" size={40} />}
            title="Samples Processed & Shared"
            total={latestStats.sampleCount}
          />
          <InfoCard
            icon={<WorkingGroupsIcon color="#00202C" width={40} height={40} />}
            title="Cohorts Pledged"
            total={latestStats.cohortCount}
          />
          <InfoCard
            icon={<ArticleIcon color="#00202C" size={40} />}
            title="Research Articles"
            total={latestStats.articleCount}
          />
        </div>
      </div>
      {guides && (
        <div css={columnContainer}>
          <Headline2>Tools and Tutorials</Headline2>
          <Paragraph accent="lead" noMargin>
            Here are some quick links to GP2 Hub resources.
          </Paragraph>
          <div css={contentCardsStyles}>
            <Card>
              <Accordion
                items={guides.map((guide: gp2Model.GuideDataObject) => ({
                  title: guide.title,
                  icon: (
                    <img
                      src={guide.icon}
                      alt={guide.title}
                      style={{ verticalAlign: 'middle' }}
                    />
                  ),
                  description: <GuideDescription blocks={guide.description} />,
                }))}
              />
            </Card>
          </div>
        </div>
      )}
      {isEnabled('DISPLAY_EVENTS') && (
        <div>
          <Headline2 styleAsHeading={3}>Upcoming Events</Headline2>
          <div css={infoStyles}>
            Here are some of the upcoming GP2 Hub events.
          </div>
          <DashboardUpcomingEvents upcomingEvents={upcomingEvents} />
          {totalOfUpcomingEvents > 3 && (
            <p css={viewAllStyles}>
              <Button
                data-testid="view-upcoming-events"
                onClick={() =>
                  history.push({
                    pathname: gp2Routes.events({}).upcoming({}).$,
                  })
                }
              >
                View All
              </Button>
            </p>
          )}
        </div>
      )}
      <div css={columnContainer}>
        <Headline2>Latest Users</Headline2>
        <Paragraph accent="lead" noMargin>
          Explore and learn more about the latest users on the hub.
        </Paragraph>
        <div css={usersCardsStyles}>
          {latestUsers?.map((user) => (
            <DashboardUserCard
              user={user}
              key={`${user.id}-${user.displayName}`}
            />
          ))}
        </div>

        <p css={viewAllStyles}>
          <Button
            data-testid="view-users"
            onClick={() =>
              history.push({
                pathname: gp2Routes.users({}).$,
              })
            }
          >
            View All
          </Button>
        </p>
      </div>
      {lastestNews ? (
        <div css={columnContainer}>
          <Headline2>Latest News</Headline2>
          <Paragraph accent="lead" noMargin>
            Here is the latest GP2 news.
          </Paragraph>
          <div css={[contentCardsStyles, columnContainer, { gap: rem(32) }]}>
            <NewsItem {...lastestNews} />
            <Link buttonStyle noMargin href={gp2Routes.newsList({}).$}>
              View All
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default DashboardPageBody;
