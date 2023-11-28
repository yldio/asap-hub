import { NewsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { lazy, useEffect } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';

const loadNewsDirectory = () =>
  import(/* webpackChunkName: "news-directory" */ './NewsDirectory');

const NewsDirectory = lazy(loadNewsDirectory);

const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadNewsDirectory();
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsPage>
          <Frame title="News">
            <NewsDirectory />
          </Frame>
        </NewsPage>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
