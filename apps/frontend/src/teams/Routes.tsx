import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Team from './Team';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/:id`} component={Team} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Users;
