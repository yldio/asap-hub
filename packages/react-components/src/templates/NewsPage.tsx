import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { perRem } from '../pixels';
import NewsPageHeader from './NewsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${24 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    36 / perRem
  }em`,
});

type NewsPageProps = ComponentProps<typeof NewsPageHeader>;

const NewsPage: React.FC<NewsPageProps> = ({ children, ...props }) => (
  <article>
    <NewsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsPage;
