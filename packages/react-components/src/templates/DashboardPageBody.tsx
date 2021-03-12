import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { discover, network, news, sharedResearch } from '@asap-hub/routing';

import { PagesSection, NewsAndEventsSection, HelpSection } from '../organisms';
import { perRem } from '../pixels';
import { Display, Card, Paragraph, Link } from '../atoms';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const containerStyles = css({
  marginTop: `${24 / perRem}em`,
});

type DashboardPageBodyProps = Omit<
  ComponentProps<typeof PagesSection>,
  'title'
> &
  Omit<ComponentProps<typeof NewsAndEventsSection>, 'title'> & {
    readonly userId: string;
    readonly teamId?: string;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  newsAndEvents,
  userId,
  teamId,
}) => (
  <div css={styles}>
    {pages.length ? (
      <PagesSection title={'Not sure where to start?'} pages={pages} />
    ) : null}
    {newsAndEvents.length ? (
      <NewsAndEventsSection
        title={'Latest News from ASAP'}
        newsAndEvents={newsAndEvents}
      />
    ) : null}
    <section>
      <Display styleAsHeading={2}>You may want to try</Display>
      <div css={containerStyles}>
        <Card>
          <ul>
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
                Stay up date with <Link href={news({}).$}>News and Events</Link>
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

export default DashboardPageBody;
