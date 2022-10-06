import { NotFoundPage, NewsDetailsPage } from '@asap-hub/react-components';
import { news as newsRoute, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useTutorialById } from './state';

const Tutorial: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(newsRoute({}).article);

  const news = useTutorialById(articleId);

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

export default Tutorial;
