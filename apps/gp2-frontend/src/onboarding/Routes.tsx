import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
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

const RoutesComponent: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadWelcome()
      .then(loadCoreDetail)
      .then(loadBackGround)
      .then(loadGroups)
      .then(loadAdditionalDetails)
      .then(loadPreview);
  }, []);

  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route
        path={`${onboarding({}).coreDetails.template}/*`}
        element={
          <Frame title={null}>
            <Onboarding>
              <Frame title={null}>
                <CoreDetails />
              </Frame>
            </Onboarding>
          </Frame>
        }
      />
      <Route
        path={`${onboarding({}).background.template}/*`}
        element={
          <Frame title={null}>
            <Onboarding>
              <Frame title={null}>
                <Background />
              </Frame>
            </Onboarding>
          </Frame>
        }
      />
      <Route
        path={onboarding({}).groups.template}
        element={
          <Frame title={null}>
            <Onboarding>
              <Frame title={null}>
                <Groups />
              </Frame>
            </Onboarding>
          </Frame>
        }
      />
      <Route
        path={`${onboarding({}).additionalDetails.template}/*`}
        element={
          <Frame title={null}>
            <Onboarding>
              <Frame title={null}>
                <AdditionalDetails />
              </Frame>
            </Onboarding>
          </Frame>
        }
      />
      <Route
        path={`${onboarding({}).preview.template}/*`}
        element={
          <Frame title={null}>
            <Onboarding>
              <Frame title={null}>
                <Preview />
              </Frame>
            </Onboarding>
          </Frame>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesComponent;
