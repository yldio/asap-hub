import { isEnabled } from '@asap-hub/flags';
import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AnalyticsPage } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Redirect, Route, Routes, useRouteMatch } from 'react-router-dom';

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

const Routes = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadLeadership().then(loadProductivity).then(loadCollaboration);
  }, []);

  const { path } = useRouteMatch();

  return (
    <Switch>
      {isEnabled('DISPLAY_ANALYTICS_PRODUCTIVITY') && (
        <Route path={path + analytics({}).productivity.template}>
          <Switch>
            <Route
              exact
              path={
                path +
                analytics({}).productivity.template +
                analytics({}).productivity({}).metric.template
              }
            >
              <AnalyticsPage>
                <Frame title="Resource & Data Sharing">
                  <ProductivityBody />
                </Frame>
              </AnalyticsPage>
            </Route>
            <Redirect
              to={analytics({}).productivity({}).metric({ metric: 'user' }).$}
            />
          </Switch>
        </Route>
      )}
      {isEnabled('DISPLAY_ANALYTICS_COLLABORATION') && (
        <Route path={path + analytics({}).collaboration.template}>
          <Switch>
            <Route
              exact
              path={
                path +
                analytics({}).collaboration.template +
                analytics({}).collaboration({}).collaborationPath.template
              }
            >
              <AnalyticsPage>
                <Frame title="Collaboration">
                  <CollaborationBody />
                </Frame>
              </AnalyticsPage>
            </Route>
            <Redirect
              to={
                analytics({})
                  .collaboration({})
                  .collaborationPath({ metric: 'user', type: 'within-team' }).$
              }
            />
          </Switch>
        </Route>
      )}
      <Route path={path + analytics({}).leadership.template}>
        <Switch>
          <Route
            exact
            path={
              path +
              analytics({}).leadership.template +
              analytics({}).leadership({}).metric.template
            }
          >
            <AnalyticsPage>
              <Frame title="Leadership & Membership">
                <LeadershipBody />
              </Frame>
            </AnalyticsPage>
          </Route>
          <Redirect
            to={
              analytics({}).leadership({}).metric({ metric: 'working-group' }).$
            }
          />
        </Switch>
      </Route>
      {isEnabled('DISPLAY_ANALYTICS_PRODUCTIVITY') ? (
        <Redirect to={analytics({}).productivity({ metric: 'user' }).$} />
      ) : (
        <Redirect
          to={analytics({}).leadership({ metric: 'working-group' }).$}
        />
      )}
    </Switch>
  );
};

export default Routes;
