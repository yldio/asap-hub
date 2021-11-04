import {
  Loading,
  NotFoundPage,
  NewsDetailsPage,
} from '@asap-hub/react-components';
import { news as newsRoute, useRouteParams } from '@asap-hub/routing';

import { useNewsById } from '../api';
import Frame from '../structure/Frame';

const News: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(newsRoute({}).article);
  const { loading, data: news } = useNewsById(articleId);

  if (loading) {
    return <Loading />;
  }

  if (news) {
    const props = {
      ...news,
      text: news.text || '',
    };
    return (
      <Frame title={news.title}>
        <NewsDetailsPage {...props} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default News;
