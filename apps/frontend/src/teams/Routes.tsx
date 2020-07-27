import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';

import Team from './Team';
import TeamList from './TeamList';
import { withUser } from '../auth';

const Users: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Layout navigation>
      <Switch>
        <Route exact path={path} component={TeamList} />
        <Route exact path={`${path}/:id`} component={Team} />
      </Switch>
    </Layout>
  );
};

export default withUser(Users);
