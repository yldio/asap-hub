import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { WhereToStartSection, LatestNewsSection } from '../organisms';
import { perRem } from '../pixels';
import { Display, Card, Paragraph, Link } from '../atoms';

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

type DashboardPageBodyProps = ComponentProps<typeof WhereToStartSection> &
  ComponentProps<typeof LatestNewsSection>;

const NewsAndEventsPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  newsAndEvents,
}) => (
  <div css={styles}>
    {pages.length ? <WhereToStartSection pages={pages} /> : null}
    {newsAndEvents.length ? (
      <LatestNewsSection newsAndEvents={newsAndEvents} />
    ) : null}
    <div>
      <Display styleAsHeading={2}>You may want to try</Display>
      <Card>
        <ul>
          <li>
            <Paragraph primary>
              Check out grantee profiles on{' '}
              <Link href="/network/users">Network</Link>
            </Paragraph>
          </li>
          <li>
            <Paragraph primary>
              Read ASAP awarded proposals in the{' '}
              <Link href="/library">Library</Link>
            </Paragraph>
          </li>
          <li>
            <Paragraph primary>
              Find other teams based on keywords on{' '}
              <Link href="/network/teams">Network</Link>
            </Paragraph>
          </li>
        </ul>
      </Card>
    </div>
  </div>
);

export default NewsAndEventsPageBody;
