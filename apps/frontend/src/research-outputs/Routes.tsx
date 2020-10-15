import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { NotFoundPage } from '@asap-hub/react-components';

import CreateResearchOutput from './CreateResearchOutput';

const Routes: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/create`} component={CreateResearchOutput} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
