import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage, ErrorCard } from '@asap-hub/react-components';

import NewsAndEvents from './NewsAndEvents';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <NewsAndEventsPage>
          <ErrorBoundary FallbackComponent={ErrorCard}>
            <NewsAndEvents />
          </ErrorBoundary>
        </NewsAndEventsPage>
      </Route>
    </Switch>
  );
};

export default Users;
