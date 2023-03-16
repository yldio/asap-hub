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
  lead,
  learnIcon,
  Paragraph,
  pixels,
  Subtitle,
  toolsIcon,
} from '@asap-hub/react-components';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
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

type DashboardPageBodyProps = {
  news: gp2.ListNewsResponse;
  totalOfUpcomingEvents: number;
  upcomingEvents: ComponentProps<typeof EventCard>[];
};

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  news,
  totalOfUpcomingEvents,
  upcomingEvents,
}) => {
  const history = useHistory();

  return (
    <>
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
                    Watch a series of short videos that highlight the different
                    aspects of the Hub.
                  </Paragraph>
                  <ExternalLink
                    href="https://hub.asap.science/discover/tutorials/d9c82f68-3f43-4dd8-83c0-179592fc8e42"
                    label="Explore videos"
                  />
                </>
              ),
            },
            {
              icon: toolsIcon,
              title: 'Explore the GP2 Generated Tools',
              description: (
                <div
                  css={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '48px',
                  })}
                >
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
              title: 'Learn more about our IP Policy',
              description: (
                <>
                  <Paragraph>
                    In support of the ASAP strategic objectives of supporting
                    collaborations, generating resources, and democratizing
                    access to data, GP2 has been established as a
                    pre-competitive consortium. GP2’s intellectual property (IP)
                    policy is briefly summarized here.
                  </Paragraph>
                  <ExternalLink
                    href="https://gp2.org/training/"
                    label="Read more"
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
