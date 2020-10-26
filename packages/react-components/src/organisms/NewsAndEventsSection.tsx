import React from 'react';
import { NewsAndEventsResponse } from '@asap-hub/model';
import css from '@emotion/css';
import { Display } from '../atoms';
import { perRem } from '../pixels';

import NewsAndEventsCard from './NewsAndEventsCard';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,

  marginTop: `${24 / perRem}em`,
});

type LatestNewsProps = {
  readonly title: string;
  readonly newsAndEvents: ReadonlyArray<NewsAndEventsResponse>;
};

const NewsAndEventsSection: React.FC<LatestNewsProps> = ({
  newsAndEvents,
  title,
}) => {
  return (
    <section>
      <Display styleAsHeading={2}>{title}</Display>
      <div css={styles}>
        {newsAndEvents.map((newsAndEvent) => {
          return <NewsAndEventsCard key={newsAndEvent.id} {...newsAndEvent} />;
        })}
      </div>
    </section>
  );
};

export default NewsAndEventsSection;
