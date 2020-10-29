import React, { Suspense } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import ErrorBoundary from '../errors/ErrorBoundary';

const loadBody = () =>
  import(/* webpackChunkName: "news-and-events-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const NewsAndEvents: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsAndEventsPage>
          <ErrorBoundary>
            <Suspense fallback="Loading...">
              <Body />
            </Suspense>
          </ErrorBoundary>
        </NewsAndEventsPage>
      </Route>
    </Switch>
  );
};

export default NewsAndEvents;
