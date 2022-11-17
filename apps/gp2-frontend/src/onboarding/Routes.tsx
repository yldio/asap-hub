import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import CoreDetails from './CoreDetails';
import Welcome from './Welcome';

const { onboarding } = gp2;

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Welcome />
      </Route>
      <Route exact path={onboarding({}).coreDetails({}).$}>
        <CoreDetails />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
