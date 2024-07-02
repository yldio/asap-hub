import { isEnabled } from '@asap-hub/flags';
import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AnalyticsPage } from '@asap-hub/react-components';
import { analyticsRoutes as analytics } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from 'react-router-dom';

const loadProductivity = () =>
  import(/* webpackChunkName: "productivity" */ './productivity/Productivity');

const loadLeadership = () =>
  import(/* webpackChunkName: "leadership" */ './leadership/Leadership');

const loadCollaboration = () =>
  import(
    /* webpackChunkName: "collaboration" */ './collaboration/Collaboration'
  );

const LeadershipBody = lazy(loadLeadership);
const ProductivityBody = lazy(loadProductivity);
const CollaborationBody = lazy(loadCollaboration);

const AnalyticsRoutes = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadLeadership().then(loadProductivity).then(loadCollaboration);
  }, []);

  // const { pathname: path } = useLocation();

  return (
    <Routes>
      {isEnabled('DISPLAY_ANALYTICS_PRODUCTIVITY') && (
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
                to={
                  analytics.DEFAULT.PRODUCTIVITY.METRIC.buildPath({
                    metric: 'user',
                  })
                  // analytics({}).productivity({}).metric({ metric: 'user' }).$
                }
              />
            }
          />
        </Route>
      )}
      {isEnabled('DISPLAY_ANALYTICS_COLLABORATION') && (
        <Route path={analytics.DEFAULT.$.COLLABORATION.relativePath}>
          <Route
            path={
              analytics.DEFAULT.COLLABORATION.$.METRIC.relativePath
              // path +
              // analytics({}).collaboration.template +
              // analytics({}).collaboration({}).collaborationPath.template
            }
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
                to={
                  analytics.DEFAULT.COLLABORATION.METRIC.buildPath({
                    metric: 'user',
                    type: 'within-team',
                  })
                  // analytics({}).collaboration({}).collaborationPath({
                  //   metric: 'user',
                  //   type: 'within-team',
                  // }).$
                }
              />
            }
          />
        </Route>
      )}
      <Route path={analytics.DEFAULT.$.LEADERSHIP.relativePath}>
        <Route
          path={
            analytics.DEFAULT.LEADERSHIP.$.METRIC.relativePath
            // path +
            // analytics({}).leadership.template +
            // analytics({}).leadership({}).metric.template
          }
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
              to={
                analytics.DEFAULT.LEADERSHIP.METRIC.buildPath({
                  metric: 'working-group',
                })
                // analytics({})
                //   .leadership({})
                //   .metric({ metric: 'working-group' }).$
              }
            />
          }
        />
      </Route>
      {isEnabled('DISPLAY_ANALYTICS_PRODUCTIVITY') ? (
        <Route
          path="*"
          element={
            <Navigate
              to={
                analytics.DEFAULT.PRODUCTIVITY.METRIC.buildPath({
                  metric: 'user',
                })
                // analytics({}).productivity({ metric: 'user' }).$
              }
            />
          }
        />
      ) : (
        <Route
          path="*"
          element={
            <Navigate
              to={
                analytics.DEFAULT.LEADERSHIP.METRIC.buildPath({
                  metric: 'working-group',
                })
                // analytics({}).leadership({ metric: 'working-group' }).$
              }
            />
          }
        />
      )}
    </Routes>
  );
};

export default AnalyticsRoutes;
