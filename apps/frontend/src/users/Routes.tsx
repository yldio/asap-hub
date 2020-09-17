import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Profile from './Profile';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/:id`} component={Profile} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Users;
