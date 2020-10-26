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
              <Paragraph primary>
                Check out grantee profiles on{' '}
                <Link href={hrefUsersNetwork}>Network</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary>
                Read ASAP awarded proposals in the{' '}
                <Link href={hrefSharedResearch}>Shared Research</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary>
                Find other teams based on keywords on{' '}
                <Link href={hrefTeamsNetwork}>Network</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary>
                Meet the ASAP team in{' '}
                <Link href={hrefDiscoverAsap}>Discover ASAP</Link>
              </Paragraph>
            </li>
            <li>
              <Paragraph primary>
                Stay up date with{' '}
                <Link href={hrefNewsAndEvents}>News and Events</Link>
              </Paragraph>
            </li>
            {hrefTeamWorkspace ? (
              <li>
                <Paragraph primary>
                  Add important links to your{' '}
                  <Link href={hrefTeamWorkspace}>Team Worspace</Link> (only your
                  team has access to it)
                </Paragraph>
              </li>
            ) : null}
            <li>
              <Paragraph primary>
                Rejoice on your fabulous <Link href={hrefProfile}>Profile</Link>
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
