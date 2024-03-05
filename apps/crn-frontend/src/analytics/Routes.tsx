import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AnalyticsPage } from '@asap-hub/react-components';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadAnalytics = () =>
  import(/* webpackChunkName: "analytics" */ './Analytics');

const AnalyticsBody = lazy(loadAnalytics);

const About: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAnalytics();
  }, []);

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <AnalyticsPage>
          <Frame title="Analytics">
            <AnalyticsBody />
          </Frame>
        </AnalyticsPage>
      </Route>
    </Switch>
  );
};

export default About;
