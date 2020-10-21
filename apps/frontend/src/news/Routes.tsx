import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import NewsAndEvents from './NewsAndEvents';
import ErrorBoundary from '../errors/ErrorBoundary';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <NewsAndEventsPage>
          <ErrorBoundary>
            <NewsAndEvents />
          </ErrorBoundary>
        </NewsAndEventsPage>
      </Route>
    </Switch>
  );
};

export default Users;
