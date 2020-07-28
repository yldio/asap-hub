import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

import News from './News';
import CheckAuth from '../auth/CheckAuth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Layout navigation>
        <Switch>
          <Route exact path={`${path}/:slug`} component={News} />
        </Switch>
      </Layout>
    </CheckAuth>
  );
};

export default Users;
