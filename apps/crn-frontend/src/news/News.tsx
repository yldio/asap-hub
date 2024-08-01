import { Frame } from '@asap-hub/frontend-utils';
import { NewsDetailsPage, NotFoundPage } from '@asap-hub/react-components';
import { newsRoutes } from '@asap-hub/routing';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { useNewsById } from './state';

const News: React.FC<Record<string, never>> = () => {
  const { id } = useTypedParams(newsRoutes.DEFAULT.$.DETAILS);

  const news = useNewsById(id);

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
