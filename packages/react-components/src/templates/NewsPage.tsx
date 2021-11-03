import { css } from '@emotion/react';

import { perRem } from '../pixels';
import NewsPageHeader from './NewsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const NewsPage: React.FC = ({ children }) => (
  <article>
    <NewsPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsPage;
