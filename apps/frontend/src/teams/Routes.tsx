import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

import Team from './Team';
import TeamList from './TeamList';
import CheckAuth from '../auth/CheckAuth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Layout navigation>
        <Switch>
          <Route exact path={path} component={TeamList} />
          <Route exact path={`${path}/:id`} component={Team} />
        </Switch>
      </Layout>
    </CheckAuth>
  );
};

export default Users;
