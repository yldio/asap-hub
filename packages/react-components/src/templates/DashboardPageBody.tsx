import React, { ComponentProps } from 'react';
import css from '@emotion/css';

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
    readonly hrefDiscoverAsap: string;
    readonly hrefNewsAndEvents: string;
    readonly hrefProfile: string;
    readonly hrefSharedResearch: string;
    readonly hrefTeamsNetwork: string;
    readonly hrefTeamWorkspace: string | undefined;
    readonly hrefUsersNetwork: string;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  newsAndEvents,
  hrefDiscoverAsap,
  hrefNewsAndEvents,
  hrefProfile,
  hrefSharedResearch,
  hrefTeamsNetwork,
  hrefTeamWorkspace,
  hrefUsersNetwork,
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
                <Link href={hrefUsersNetwork}>Network</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary accent="lead">
                Read team proposals in{' '}
                <Link href={hrefSharedResearch}>Shared Research</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary accent="lead">
                Meet the ASAP team in{' '}
                <Link href={hrefDiscoverAsap}>Discover ASAP</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary accent="lead">
                Stay up date with{' '}
                <Link href={hrefNewsAndEvents}>News and Events</Link>
              </Paragraph>
            </li>
            {hrefTeamWorkspace ? (
              <li>
                <Paragraph primary accent="lead">
                  Add important links to your private{' '}
                  <Link href={hrefTeamWorkspace}>Team Workspace</Link>
                </Paragraph>
              </li>
            ) : null}
            <li>
              <Paragraph primary accent="lead">
                View and edit your own <Link href={hrefProfile}>Profile</Link>
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
