import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import CreateResearchOutput from './CreateResearchOutput';

const Routes: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/create`} component={CreateResearchOutput} />
      <Route>Not Found</Route>
    </Switch>
  );
};

export default Routes;
