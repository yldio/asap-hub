import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';

import Welcome from './Welcome';

const Users: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:code`} component={Welcome} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Users;
