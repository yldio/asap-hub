import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Team from './Team';
import TeamList from './TeamList';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={TeamList} />
      <Route path={`${path}/:id`} component={Team} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Users;
