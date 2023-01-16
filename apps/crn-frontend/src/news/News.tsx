import { NotFoundPage, NewsDetailsPage } from '@asap-hub/react-components';
import { news as newsRoute, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useNewsById } from './state';

const News: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(newsRoute({}).article);

  const news = useNewsById(articleId);

  if (news) {
    const props = {
      ...news,
      text: news.text || '',
    };
    return (
      <Frame title={news.title}>
        <NewsDetailsPage {...props} type="News" />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default News;
