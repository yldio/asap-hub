import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AnalyticsPage } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

const loadProductivity = () =>
  import(/* webpackChunkName: "productivity" */ './productivity/Productivity');

const loadLeadership = () =>
  import(/* webpackChunkName: "leadership" */ './leadership/Leadership');

const LeadershipBody = lazy(loadLeadership);
const ProductivityBody = lazy(loadProductivity);

const About: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadLeadership().then(loadLeadership);
  }, []);

  const { path } = useRouteMatch();

  return (
    <Switch>
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
              analytics({}).leadership({}).metric({ metric: 'workingGroup' }).$
            }
          />
        </Switch>
      </Route>
      <Redirect to={analytics({}).productivity({ metric: 'user' }).$} />
    </Switch>
  );
};

export default About;
