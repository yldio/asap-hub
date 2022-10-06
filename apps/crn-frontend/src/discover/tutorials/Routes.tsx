import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsPage } from '@asap-hub/react-components';
import { tutorials } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useSearch } from '../../hooks';

// const loadNewsList = () =>
//   import(/* webpackChunkName: "tutorials-list" */ './NewsList');
const loadNews = () =>
  import(/* webpackChunkName: "tutorials-details-page" */ './Tutorials');
// const NewsList = lazy(loadNewsList);
const NewsDetailsPage = lazy(loadNews);

const News: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();
  useEffect(() => {
    console.log('passou aqui');
    loadNews();
  });
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();
  return (
    <Switch>
      <Route exact path={path}>
        <NewsPage
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        >
          {/* <Frame title={null}>
            <NewsList filters={filters} searchQuery={debouncedSearchQuery} />
          </Frame> */}
        </NewsPage>
      </Route>
      <Route path={path + tutorials({}).article.template}>
        <Frame title={null}>
          <NewsDetailsPage />
        </Frame>
      </Route>
    </Switch>
  );
};

export default News;
