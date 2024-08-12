import { isEnabled } from '@asap-hub/flags';
import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AnalyticsPage } from '@asap-hub/react-components';
import { analyticsRoutes as analytics } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const loadProductivity = () =>
  import(/* webpackChunkName: "productivity" */ './productivity/Productivity');

const loadLeadership = () =>
  import(/* webpackChunkName: "leadership" */ './leadership/Leadership');

const loadCollaboration = () =>
  import(
    /* webpackChunkName: "collaboration" */ './collaboration/Collaboration'
  );

const loadEngagement = () =>
  import(/* webpackChunkName: "engagement" */ './engagement/Engagement');

const LeadershipBody = lazy(loadLeadership);
const ProductivityBody = lazy(loadProductivity);
const CollaborationBody = lazy(loadCollaboration);
const EngagementBody = lazy(loadEngagement);

const AnalyticsRoutes = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadLeadership().then(loadProductivity).then(loadCollaboration);
  }, []);

  return (
    <Routes>
      <Route path={analytics.DEFAULT.$.PRODUCTIVITY.relativePath}>
        <Route
          path={analytics.DEFAULT.PRODUCTIVITY.$.METRIC.relativePath}
          element={
            <AnalyticsPage>
              <Frame title="Resource & Data Sharing">
                <ProductivityBody />
              </Frame>
            </AnalyticsPage>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={analytics.DEFAULT.PRODUCTIVITY.METRIC.buildPath({
                metric: 'user',
              })}
            />
          }
        />
      </Route>
      {isEnabled('DISPLAY_ANALYTICS_BETA') && (
        <Route path={analytics.DEFAULT.$.COLLABORATION.relativePath}>
          <Route
            path={analytics.DEFAULT.COLLABORATION.$.METRIC.relativePath}
            element={
              <AnalyticsPage>
                <Frame title="Collaboration">
                  <CollaborationBody />
                </Frame>
              </AnalyticsPage>
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={analytics.DEFAULT.COLLABORATION.METRIC.buildPath({
                  metric: 'user',
                  type: 'within-team',
                })}
              />
            }
          />
        </Route>
      )}
      {isEnabled('DISPLAY_ANALYTICS_BETA') && (
        <Route
          path={analytics.DEFAULT.$.ENGAGEMENT.relativePath}
          element={
            <AnalyticsPage>
              <Frame title="Engagement">
                <EngagementBody />
              </Frame>
            </AnalyticsPage>
          }
        />
      )}
      <Route path={analytics.DEFAULT.$.LEADERSHIP.relativePath}>
        <Route
          path={analytics.DEFAULT.LEADERSHIP.$.METRIC.relativePath}
          element={
            <AnalyticsPage>
              <Frame title="Leadership & Membership">
                <LeadershipBody />
              </Frame>
            </AnalyticsPage>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={analytics.DEFAULT.LEADERSHIP.METRIC.buildPath({
                metric: 'working-group',
              })}
            />
          }
        />
      </Route>
      <Route
        path="*"
        element={
          <Navigate
            to={analytics.DEFAULT.PRODUCTIVITY.METRIC.buildPath({
              metric: 'user',
            })}
          />
        }
      />
    </Routes>
  );
};

export default AnalyticsRoutes;
