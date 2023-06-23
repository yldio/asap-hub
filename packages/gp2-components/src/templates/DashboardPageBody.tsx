import { gp2 } from '@asap-hub/model';
import {
  Accordion,
  Button,
  Card,
  confidentialIcon,
  DashboardUpcomingEvents,
  EventCard,
  ExternalLink,
  Headline2,
  LabIcon,
  lead,
  learnIcon,
  LibraryIcon,
  Paragraph,
  pixels,
  Subtitle,
  toolsIcon,
} from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { ArticleIcon, graduateIcon, projectIcon } from '../icons';
import { mobileQuery } from '../layout';
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

const accodionItemStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
});

const latestStatsWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

const latestStatsCardsStyles = css({
  display: 'flex',
  gap: '24px',
  width: '100%',
  justifyContent: 'center',
  marginTop: '32px',
  [mobileQuery]: {
    flexDirection: 'column',
  },
});

type DashboardPageBodyProps = {
  news: gp2.ListNewsResponse;
  latestStats: gp2.DashboardResponse;
  totalOfUpcomingEvents: number;
  upcomingEvents: ComponentProps<typeof EventCard>[];
};

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  latestStats,
  totalOfUpcomingEvents,
  upcomingEvents,
}) => {
  const history = useHistory();

  return (
    <>
      <div css={latestStatsWrapperStyles}>
        <Headline2>Latest Stats</Headline2>
        <Paragraph accent="lead" noMargin>
          Here are some key actions to take within the GP2 network:
        </Paragraph>
        <div css={latestStatsCardsStyles}>
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
      <Card>
        <Headline2>Tools and Tutorials</Headline2>
        <Paragraph accent="lead">
          Here are some key actions to take within the GP2 network:
        </Paragraph>
        <Accordion
          items={[
            {
              icon: learnIcon,
              title: 'Discover how to use the GP2 Hub',
              description: (
                <>
                  <Paragraph>
                    Learn more about the GP2 Hub and how to use different
                    aspects.
                  </Paragraph>
                </>
              ),
            },
            {
              icon: toolsIcon,
              title: 'Explore the GP2 Generated Tools',
              description: (
                <div css={accodionItemStyles}>
                  <article>
                    <Subtitle>Cohort Dashboard</Subtitle>
                    <Paragraph>
                      The new cohort dashboard provides a real-time look at each
                      cohort within the GP2 network, including location data,
                      number of samples for genotyping, and an ancestral
                      breakdown of completed samples.
                    </Paragraph>
                    <ExternalLink
                      href="https://gp2.org/cohort-dashboard-advanced/"
                      label="View Cohort Dashboard"
                    />
                  </article>
                  <article>
                    <Subtitle>Monogenic Resource Map</Subtitle>
                    <Paragraph>
                      This online tool provides a look at data from GP2 or
                      GP2-affiliated centers. Explore participant numbers,
                      detailed clinical research and clinical trial activities
                      and facilities for clinics focusing on monogenic
                      Parkinson’s research.
                    </Paragraph>
                    <ExternalLink
                      href="https://gp2.org/monogenic-resource-map/"
                      label="View Monogenic Map"
                    />
                  </article>
                  <article>
                    <Subtitle>Monogenic Portal</Subtitle>
                    <Paragraph>
                      The Monogenic Portal gives researchers from around the
                      globe a platform for sharing samples and key insights.
                      Insights are focused on the studying early-onset cases of
                      PD as well as cases with a family history, or atypical
                      clinical presentations.
                    </Paragraph>
                    <ExternalLink
                      href="https://monogenic.gp2.org/monogenicportal.html"
                      label="View Monogenic Portal"
                    />
                  </article>
                </div>
              ),
            },
            {
              icon: confidentialIcon,
              title: 'Learn More About our Policies',
              description: (
                <div css={accodionItemStyles}>
                  <article>
                    <Subtitle>IP Policy</Subtitle>
                    <Paragraph>
                      In support of the ASAP strategic objectives of supporting
                      collaborations, generating resources, and democratizing
                      access to data, GP2 has been established as a
                      pre-competitive consortium. GP2’s intellectual property
                      (IP) policy is briefly summarized here.
                    </Paragraph>
                    <ExternalLink
                      href="https://gp2.org/resources/intellectual-property-policy/"
                      label="Read more"
                    />
                  </article>
                  <article>
                    <Subtitle>Publication Policy</Subtitle>
                    <Paragraph>
                      Dissemination of GP2 data is a major goal of the GP2
                      project and ASAP encourages the broad, rapid, and open
                      publication of results. Read about our publication
                      policies to learn more.
                    </Paragraph>
                    <ExternalLink
                      href="https://gp2.org/resources/publicationpolicy/"
                      label="Read more"
                    />
                  </article>
                  <article>
                    <Subtitle>Code of Conduct</Subtitle>
                    <Paragraph>
                      Each investigator on GP2 should have a clear understanding
                      of GP2’s goals, the central tenets underlying the
                      achievement of these goals, and trust. In order to
                      facilitate these goals, we describe the code of conduct
                      for investigators in GP2. Read about it here.
                    </Paragraph>
                    <ExternalLink
                      href="https://gp2.org/resources/codeofconduct/"
                      label="Read more"
                    />
                  </article>
                </div>
              ),
            },
            {
              icon: projectIcon,
              title: 'Request a New Project',
              description: (
                <>
                  <Paragraph>
                    If you are interested in starting a new project, please
                    complete the proposal request form below.
                  </Paragraph>
                  <ExternalLink
                    href="https://docs.google.com/forms/d/e/1FAIpQLScYnKgzk-gxFW6a8CgEkwowjCnWGdWqLxwF9YWacYHMnSaPzg/viewform"
                    label="Request New Project"
                  />
                </>
              ),
            },
            {
              icon: graduateIcon,
              title: 'Explore GP2 Online Trainings',
              description: (
                <>
                  <Paragraph>
                    View all available training courses in the GP2 Learning
                    Platform.
                  </Paragraph>
                  <ExternalLink
                    href="https://gp2.org/training/"
                    label="View Courses"
                  />
                </>
              ),
            },
          ]}
        />
      </Card>
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
