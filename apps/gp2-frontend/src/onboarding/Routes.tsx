import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import Onboarding from './Onboarding';

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
      <Route exact path={onboarding({}).coreDetails({}).$}>
        <Onboarding>
          <CoreDetails />
        </Onboarding>
      </Route>
      <Route exact path={onboarding({}).background({}).$}>
        <Onboarding>
          <div>Background</div>
        </Onboarding>
      </Route>
      <Route exact path={onboarding({}).groups({}).$}>
        <Onboarding>
          <div>GP2 Groups</div>
        </Onboarding>
      </Route>
      <Route exact path={onboarding({}).additionalDetails({}).$}>
        <Onboarding>
          <div>Additional Details</div>
        </Onboarding>
      </Route>
      <Route exact path={onboarding({}).preview({}).$}>
        <Onboarding>
          <div>Preview</div>
        </Onboarding>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
