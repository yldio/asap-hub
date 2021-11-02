import { FC, lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsPage } from '@asap-hub/react-components';
import { news } from '@asap-hub/routing';

import Frame from '../structure/Frame';

const loadNewsList = () =>
  import(/* webpackChunkName: "news-list" */ './NewsList');
const loadNewsOrEvent = () => import(/* webpackChunkName: "news" */ './News');
const NewsList = lazy(loadNewsList);
const NewsOrEventPage = lazy(loadNewsOrEvent);
loadNewsList();

const NewsAndEvents: FC<Record<string, never>> = () => {
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
        <NewsOrEventPage />
      </Route>
    </Switch>
  );
};

export default NewsAndEvents;
