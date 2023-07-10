import { gp2 } from '@asap-hub/model';
import {
  Accordion,
  Button,
  Card,
  DashboardUpcomingEvents,
  EventCard,
  Headline2,
  LabIcon,
  lead,
  learnIcon,
  LibraryIcon,
  Paragraph,
  pixels,
  RemindersCard,
} from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { ArticleIcon } from '../icons';
import { mobileQuery } from '../layout';
import GuideDescription from '../molecules/GuideDescription';
import InfoCard from '../molecules/InfoCard';
import DashboardNews from '../organisms/DashboardNews';

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
  marginTop: rem(32),
  [mobileQuery]: {
    flexDirection: 'column',
  },
});

type DashboardPageBodyProps = {
  news: gp2.ListNewsResponse;
  latestStats: gp2.StatsDataObject;
  totalOfUpcomingEvents: number;
  announcements?: ComponentProps<typeof RemindersCard>['reminders'];
  upcomingEvents: ComponentProps<typeof EventCard>[];
  guides?: gp2.GuideDataObject[];
};

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  latestStats,
  totalOfUpcomingEvents,
  announcements,
  upcomingEvents,
  guides,
}) => {
  const history = useHistory();

  return (
    <>
      {announcements ? (
        <div css={columnContainer}>
          <Headline2>Announcements</Headline2>
          <Paragraph accent="lead" noMargin>
            Here are the latest announcements from admins.
          </Paragraph>
          <div css={contentCardsStyles}>
            <RemindersCard reminders={announcements} canPublish />
          </div>
        </div>
      ) : null}
      <div css={columnContainer}>
        <Headline2>Latest Stats</Headline2>
        <Paragraph accent="lead" noMargin>
          Here are some key actions to take within the GP2 network:
        </Paragraph>
        <div css={contentCardsStyles}>
          <InfoCard
            icon={<LabIcon color="#00202C" size={40} />}
            title="Samples Completed"
            total={latestStats.sampleCount}
          />
          <InfoCard
            icon={<LibraryIcon color="#00202C" size={40} />}
            title="Cohorts"
            total={latestStats.cohortCount}
          />
          <InfoCard
            icon={<ArticleIcon color="#00202C" size={40} />}
            title="Article Numbers"
            total={latestStats.articleCount}
          />
        </div>
      </div>
      {guides && (
        <Card>
          <Headline2>Tools and Tutorials</Headline2>
          <Paragraph accent="lead">
            Here are some key actions to take within the GP2 Hub.
          </Paragraph>
          <Accordion
            items={guides.map((guide: gp2.GuideDataObject) => ({
              title: guide.title,
              icon: <img src={guide.icon} alt={guide.title} />,
              description: <GuideDescription blocks={guide.description} />,
            }))}
          />
        </Card>
      )}
      {!!news.total && <DashboardNews items={news.items} />}

      <div>
        <Headline2 styleAsHeading={3}>Upcoming Events</Headline2>
        <div css={infoStyles}>
          Here are some of the upcoming events happening within the network.
        </div>
        <DashboardUpcomingEvents upcomingEvents={upcomingEvents} />
        {totalOfUpcomingEvents > 3 && (
          <p css={viewAllStyles} data-testid="view-upcoming-events">
            <Button
              onClick={() =>
                history.push({ pathname: events({}).upcoming({}).$ })
              }
            >
              View All
            </Button>
          </p>
        )}
      </div>
    </>
  );
};
export default DashboardPageBody;
