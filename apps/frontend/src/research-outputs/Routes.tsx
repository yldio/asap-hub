import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import CreateResearchOutput from './CreateResearchOutput';
import CheckAuth from '../auth/CheckAuth';
import ResearchOutput from './ResearchOutput';

const Routes: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <CheckAuth>
      <Switch>
        <Route exact path={`${path}/create`} component={CreateResearchOutput} />
        <Route exact path={`${path}/:id`} component={ResearchOutput} />
      </Switch>
    </CheckAuth>
  );
};

export default Routes;
