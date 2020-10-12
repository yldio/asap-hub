import React from 'react';
import { NewsAndEventsResponse } from '@asap-hub/model';
import css from '@emotion/css';
import { Display } from '../atoms';
import { perRem } from '../pixels';

import NewsAndEventsCard from './NewsAndEventsCard';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,

  paddingTop: `${24 / perRem}em`,
});

type LatestNewsProps = {
  readonly newsAndEvents: ReadonlyArray<NewsAndEventsResponse>;
};

const LatestNews: React.FC<LatestNewsProps> = ({ newsAndEvents }) => {
  return (
    <section>
      <Display styleAsHeading={2}>Latest news from ASAP</Display>
      <div css={styles}>
        {newsAndEvents.map((newsAndEvent) => {
          return <NewsAndEventsCard key={newsAndEvent.id} {...newsAndEvent} />;
        })}
      </div>
    </section>
  );
};

export default LatestNews;
