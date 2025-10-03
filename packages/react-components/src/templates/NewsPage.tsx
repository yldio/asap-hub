import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { rem } from '../pixels';
import NewsPageHeader from './NewsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${rem(24)} ${contentSidePaddingWithNavigation(8)} ${rem(36)}`,
});

type NewsPageProps = ComponentProps<typeof NewsPageHeader>;

const NewsPage: React.FC<NewsPageProps> = ({ children, ...props }) => (
  <article>
    <NewsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsPage;
