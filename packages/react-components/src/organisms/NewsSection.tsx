import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { Display } from '../atoms';
import { perRem } from '../pixels';

import NewsCard from './NewsCard';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,

  marginTop: `${24 / perRem}em`,
});

type LatestNewsProps = {
  readonly title: string;
  readonly news: ReadonlyArray<ComponentProps<typeof NewsCard>>;
};

const NewsSection: React.FC<LatestNewsProps> = ({ news, title }) => (
  <section>
    <Display styleAsHeading={3}>{title}</Display>
    <div css={styles}>
      {news.map((newsAndEvent) => (
        <NewsCard key={newsAndEvent.id} {...newsAndEvent} />
      ))}
    </div>
  </section>
);

export default NewsSection;
