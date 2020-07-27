import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

import ProfileList from './ProfileList';
import Profile from './Profile';
import CheckAuth from '../auth/CheckAuth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Layout navigation>
        <Switch>
          <Route exact path={path} component={ProfileList} />
          <Route exact path={`${path}/:id`} component={Profile} />
        </Switch>
      </Layout>
    </CheckAuth>
  );
};

export default Users;
