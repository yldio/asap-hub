import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { BasicLayout } from '@asap-hub/gp2-components';
import OnboardingPage from './OnboardingPage';

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
        <BasicLayout>
          <Welcome />
        </BasicLayout>
      </Route>
      <BasicLayout noPadding>
        <OnboardingPage>
          <Route exact path={onboarding({}).coreDetails({}).$}>
            <CoreDetails />
          </Route>
          <Route exact path={onboarding({}).background({}).$}>
            <div>Background</div>
          </Route>
          <Route exact path={onboarding({}).groups({}).$}>
            <div>GP2 Groups</div>
          </Route>
          <Route exact path={onboarding({}).additionalDetails({}).$}>
            <div>Additional Details</div>
          </Route>
          <Route exact path={onboarding({}).preview({}).$}>
            <div>Preview</div>
          </Route>
        </OnboardingPage>
      </BasicLayout>

      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
