import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import ProfileList from './ProfileList';
import Profile from './Profile';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={ProfileList} />
      <Route path={`${path}/:id`} component={Profile} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Users;
