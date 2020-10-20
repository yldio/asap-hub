import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { WhereToStartSection, LatestNewsSection } from '../organisms';
import { perRem } from '../pixels';
import { Display, Card, Paragraph, Link } from '../atoms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../utils';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const containerStyles = css({
  marginTop: `${24 / perRem}em`,
});

const bottomStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type DashboardPageBodyProps = ComponentProps<typeof WhereToStartSection> &
  ComponentProps<typeof LatestNewsSection> & {
    readonly hrefLibrary: string;
    readonly hrefNewsAndEvents: string;
    readonly hrefProfile: string;
    readonly hrefTeamsNetwork: string;
    readonly hrefTeamWorkspace: string | undefined;
    readonly hrefUsersNetwork: string;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  newsAndEvents,
  hrefProfile,
  hrefTeamWorkspace,
  hrefUsersNetwork,
  hrefLibrary,
  hrefTeamsNetwork,
  hrefNewsAndEvents,
}) => (
  <div css={styles}>
    {pages.length ? <WhereToStartSection pages={pages} /> : null}
    {newsAndEvents.length ? (
      <LatestNewsSection newsAndEvents={newsAndEvents} />
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
                <Link href={hrefLibrary}>Library</Link>
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
    <section css={bottomStyles}>
      <CtaCard
        href={createMailTo('grants@parkinsonsroadmap.org', {
          subject: 'Hub Grants',
        })}
        buttonText="Contact Us"
      >
        <strong>Need help with grant-related matter?</strong>
        <br /> ASAP and the Michael J Fox Foundation are here to help
      </CtaCard>
      <Paragraph>
        If you're facing a technical issue with the Hub, please{' '}
        <Link
          href={createMailTo('info@asap.science', { subject: 'Hub Support' })}
        >
          get in touch
        </Link>
        . Our support team is happy to help!
      </Paragraph>
    </section>
  </div>
);

export default DashboardPageBody;
