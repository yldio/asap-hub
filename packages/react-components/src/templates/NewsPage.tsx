import { css } from '@emotion/react';

import { perRem } from '../pixels';
import NewsAndEventsPageHeader from './NewsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const NewsAndEventsPage: React.FC = ({ children }) => (
  <article>
    <NewsAndEventsPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsAndEventsPage;
