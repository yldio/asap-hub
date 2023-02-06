import { NotFoundPage } from '@asap-hub/react-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Events from './Events';

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Events />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
