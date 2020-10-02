import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import NewsAndEvents from './NewsAndEvents';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <NewsAndEventsPage>
          <NewsAndEvents />
        </NewsAndEventsPage>
      </Route>
    </Switch>
  );
};

export default Users;
