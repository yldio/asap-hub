import { NotFoundPage, NewsDetailsPage } from '@asap-hub/react-components';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';

import { useNewsById } from './state';

const News: React.FC<Record<string, never>> = () => {
  console.log('aqui');
  const { articleId } = useParams<{ articleId: string }>();

  console.log('articleId', articleId);
  const news = useNewsById(articleId || '7ooqZ1GAU7Dr0veb0qKk4K');

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

  console.log('before not found');

  return <NotFoundPage />;
};

export default News;
