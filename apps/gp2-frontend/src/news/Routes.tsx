import { NotFoundPage } from '@asap-hub/react-components';
import { lazy, useEffect } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadNewsList = () =>
  import(/* webpackChunkName: "news-list" */ './NewsList');

const NewsList = lazy(loadNewsList);

const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadNewsList();
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsList />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
