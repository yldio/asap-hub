import { ComponentProps } from 'react';

import NewsPageHeader from './NewsPageHeader';
import PageContraints from './PageConstraints';

type NewsPageProps = ComponentProps<typeof NewsPageHeader>;

const NewsPage: React.FC<NewsPageProps> = ({ children, ...props }) => (
  <article>
    <NewsPageHeader {...props} />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default NewsPage;
