import { NewsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';
import Frame from '../Frame';

const loadNewsDirectory = () =>
  import(/* webpackChunkName: "news-directory" */ './NewsDirectory');

const NewsDirectory = lazy(loadNewsDirectory);
const { newsList } = gp2;

const NewsRoutes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadNewsDirectory();
  }, []);
  // const { path } = useMatch();

  return (
    <Routes>
      <Route
        path={newsList.DEFAULT.$.LIST.relativePath}
        element={
          <NewsPage>
            <Frame title="News">
              <NewsDirectory />
            </Frame>
          </NewsPage>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default NewsRoutes;
