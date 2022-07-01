import { FC, lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsPage } from '@asap-hub/react-components';
import { news } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

const loadNewsList = () =>
  import(/* webpackChunkName: "news-list" */ './NewsList');
const loadNews = () => import(/* webpackChunkName: "news" */ './News');
const NewsList = lazy(loadNewsList);
const NewsDetailsPage = lazy(loadNews);
loadNewsList();

const News: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <NewsPage>
          <Frame title={null}>
            <NewsList />
          </Frame>
        </NewsPage>
      </Route>
      <Route path={path + news({}).article.template}>
        <Frame title={null}>
          <NewsDetailsPage />
        </Frame>
      </Route>
    </Switch>
  );
};

export default News;
