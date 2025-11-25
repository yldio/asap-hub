import { NewsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { lazy, useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';
import Frame from '../Frame';

const loadNewsDirectory = () =>
  import(/* webpackChunkName: "news-directory" */ './NewsDirectory');

const NewsDirectory = lazy(loadNewsDirectory);

const RoutesComponent: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadNewsDirectory();
  }, []);

  return (
    <Routes>
      <Route
        index
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

export default RoutesComponent;
