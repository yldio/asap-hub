import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import CreateResearchOutput from './CreateResearchOutput';
import ResearchOutput from './ResearchOutput';

const Routes: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/create`} component={CreateResearchOutput} />
      <Route exact path={`${path}/:id`} component={ResearchOutput} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Routes;
