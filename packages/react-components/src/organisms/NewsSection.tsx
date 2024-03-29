import { NewsResponse, NewsType, TutorialsResponse } from '@asap-hub/model';
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
  readonly type: NewsType;
  readonly title: string;
  readonly subtitle?: string;
  readonly news: ReadonlyArray<NewsResponse | TutorialsResponse>;
};

const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  type,
  title,
  subtitle,
}) => (
  <section>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    {subtitle && <Paragraph accent="lead">{subtitle}</Paragraph>}
    <div css={styles}>
      {news.map((newsItem) => (
        <NewsCard key={newsItem.id} {...newsItem} type={type} />
      ))}
    </div>
  </section>
);

export default NewsSection;
