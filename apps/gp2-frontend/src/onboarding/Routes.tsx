import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import Onboarding from './Onboarding';
import Background from './Background';
import AdditionalDetails from './AdditionalDetails';

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
      <Onboarding>
        <Route path={onboarding({}).coreDetails({}).$}>
          <CoreDetails />
        </Route>
        <Route path={onboarding({}).background({}).$}>
          <Background />
        </Route>
        <Route path={onboarding({}).groups({}).$}>
          <div>GP2 Groups</div>
        </Route>
        <Route path={onboarding({}).additionalDetails({}).$}>
          <AdditionalDetails />
        </Route>
        <Route path={onboarding({}).preview({}).$}>
          <div>Preview</div>
        </Route>
      </Onboarding>

      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
