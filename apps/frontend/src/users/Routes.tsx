import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import ProfileList from './ProfileList';
import Profile from './Profile';
import CheckAuth from '../auth/CheckAuth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Switch>
        <Route exact path={path} component={ProfileList} />
        <Route path={`${path}/:id`} component={Profile} />
      </Switch>
    </CheckAuth>
  );
};

export default Users;
