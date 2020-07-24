import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Team from './Team';
import TeamList from './TeamList';
import CheckAuth from '../auth/CheckAuth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Switch>
        <Route exact path={path} component={TeamList} />
        <Route exact path={`${path}/:id`} component={Team} />
      </Switch>
    </CheckAuth>
  );
};

export default Users;
