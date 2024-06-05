import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { NewsPage } from '@asap-hub/react-components';
import { newsRoutes } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useSearch } from '../hooks';

const loadNewsList = () =>
  import(/* webpackChunkName: "news-list" */ './NewsList');
const loadNews = () =>
  import(/* webpackChunkName: "news-details-page" */ './News');
const NewsList = lazy(loadNewsList);
const NewsDetailsPage = lazy(loadNews);

const News: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadNews().then(loadNewsList);
  });
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();
  return (
    <Routes>
      <Route
        path={newsRoutes.DEFAULT.$.LIST.path}
        element={
          <NewsPage
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
          >
            <Frame title={null}>
              <NewsList filters={filters} searchQuery={debouncedSearchQuery} />
            </Frame>
          </NewsPage>
        }
      />

      <Route
        path={newsRoutes.DEFAULT.$.DETAILS.path}
        element={
          <Frame title={null}>
            <NewsDetailsPage />
          </Frame>
        }
      />
    </Routes>
  );
};

export default News;
