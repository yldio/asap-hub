import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { lazy, useEffect } from 'react';

const loadWelcome = () =>
  import(/* webpackChunkName: "onboarding-welcome" */ './Welcome');
const loadCoreDetail = () =>
  import(/* webpackChunkName: "onboarding-core-details" */ './CoreDetails');

const Welcome = lazy(loadWelcome);
const CoreDetails = lazy(loadCoreDetail);

const { onboarding } = gp2;

const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadWelcome().then(loadCoreDetail);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Welcome />
      </Route>
      <Route path={onboarding({}).coreDetails({}).$}>
        <CoreDetails />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
