import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { Headline2, Paragraph } from '../atoms';
import { perRem } from '../pixels';

import NewsCard from './NewsCard';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,

  marginTop: `${24 / perRem}em`,
});

type NewsSectionProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly news: ReadonlyArray<ComponentProps<typeof NewsCard>>;
};

const NewsSection: React.FC<NewsSectionProps> = ({ news, title, subtitle }) => (
  <section>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    {subtitle && <Paragraph accent="lead">{subtitle}</Paragraph>}
    <div css={styles}>
      {news.map((newsItem) => (
        <NewsCard key={newsItem.id} {...newsItem} />
      ))}
    </div>
  </section>
);

export default NewsSection;
