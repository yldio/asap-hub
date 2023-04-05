import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';
import Onboarding from './Onboarding';

const loadWelcome = () =>
  import(/* webpackChunkName: "onboarding-welcome" */ './Welcome');
const loadCoreDetail = () =>
  import(/* webpackChunkName: "onboarding-core-details" */ './CoreDetails');
const loadBackGround = () =>
  import(/* webpackChunkName: "onboarding-background" */ './Background');

const loadGroups = () =>
  import(/* webpackChunkName: "onboarding-groups" */ './Groups');
const loadAdditionalDetails = () =>
  import(
    /* webpackChunkName: "onboarding-additional-details" */ './AdditionalDetails'
  );
const loadPreview = () =>
  import(/* webpackChunkName: "onboarding-additional-details" */ './Preview');
const Welcome = lazy(loadWelcome);
const CoreDetails = lazy(loadCoreDetail);
const Background = lazy(loadBackGround);
const Groups = lazy(loadGroups);
const AdditionalDetails = lazy(loadAdditionalDetails);
const Preview = lazy(loadPreview);

const { onboarding } = gp2;

const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadWelcome()
      .then(loadCoreDetail)
      .then(loadBackGround)
      .then(loadGroups)
      .then(loadAdditionalDetails)
      .then(loadPreview);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Welcome />
      </Route>
      <Frame title={null}>
        <Onboarding>
          <Frame title={null}>
            <Route path={onboarding({}).coreDetails({}).$}>
              <CoreDetails />
            </Route>
            <Route path={onboarding({}).background({}).$}>
              <Background />
            </Route>
            <Route path={onboarding({}).groups({}).$}>
              <Groups />
            </Route>
            <Route path={onboarding({}).additionalDetails({}).$}>
              <AdditionalDetails />
            </Route>
            <Route path={onboarding({}).preview({}).$}>
              <Preview />
            </Route>
          </Frame>
        </Onboarding>
      </Frame>
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
