import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import {
  AnalyticsPage,
  ExportAnalyticsModal,
} from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useAnalyticsAlgolia } from '../hooks/algolia';

import { downloadAnalyticsXLSX } from './utils/export';

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

const Routes = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadLeadership().then(loadProductivity).then(loadCollaboration);
  }, []);

  const { path } = useRouteMatch();

  const { client } = useAnalyticsAlgolia();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleExportAnalytics = () => setIsModalOpen(true);

  const handleDownload = downloadAnalyticsXLSX(client);

  return (
    <>
      {isModalOpen && (
        <ExportAnalyticsModal
          onDismiss={() => setIsModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
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
              <AnalyticsPage onExportAnalytics={handleExportAnalytics}>
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
              <AnalyticsPage onExportAnalytics={handleExportAnalytics}>
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
        <Route path={path + analytics({}).engagement.template}>
          <AnalyticsPage onExportAnalytics={handleExportAnalytics}>
            <Frame title="Engagement">
              <EngagementBody />
            </Frame>
          </AnalyticsPage>
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
              <AnalyticsPage onExportAnalytics={handleExportAnalytics}>
                <Frame title="Leadership & Membership">
                  <LeadershipBody />
                </Frame>
              </AnalyticsPage>
            </Route>
            <Redirect
              to={
                analytics({}).leadership({}).metric({ metric: 'working-group' })
                  .$
              }
            />
          </Switch>
        </Route>
        <Redirect to={analytics({}).productivity({ metric: 'user' }).$} />)
      </Switch>
    </>
  );
};

export default Routes;
