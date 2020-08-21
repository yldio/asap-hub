import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import News from './News';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:slug`} component={News} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Users;
