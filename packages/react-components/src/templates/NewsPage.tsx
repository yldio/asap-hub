import { ComponentProps } from 'react';

import NewsPageHeader from './NewsPageHeader';
import PageConstraints from './PageConstraints';

type NewsPageProps = ComponentProps<typeof NewsPageHeader>;

const NewsPage: React.FC<NewsPageProps> = ({ children, ...props }) => (
  <article>
    <NewsPageHeader {...props} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default NewsPage;
