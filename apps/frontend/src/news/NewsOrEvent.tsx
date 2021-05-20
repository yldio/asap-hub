import {
  Loading,
  NotFoundPage,
  NewsOrEventPage,
} from '@asap-hub/react-components';
import { news, useRouteParams } from '@asap-hub/routing';

import { useNewsOrEvent } from '../api';
import Frame from '../structure/Frame';

const NewsOrEvent: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(news({}).article);
  const { loading, data: newsOrEvent } = useNewsOrEvent(articleId);

  if (loading) {
    return <Loading />;
  }

  if (newsOrEvent) {
    const props = {
      ...newsOrEvent,
      text: newsOrEvent.text || '',
    };
    return (
      <Frame title={newsOrEvent.title}>
        <NewsOrEventPage {...props} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default NewsOrEvent;
