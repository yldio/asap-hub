import { Frame } from '@asap-hub/frontend-utils';
import { Layout } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Route } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useUserById } from './users/state';

const {
  workingGroups: workingGroupsRoute,
  users: usersRoute,
  projects: projectsRoute,
} = gp2Route;
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "working-groups" */ './working-groups/Routes');

const loadProjects = () =>
  import(/* webpackChunkName: "projects" */ './projects/Routes');

const loadUsers = () =>
  import(/* webpackChunkName: "users" */ './users/Routes');

const Dashboard = lazy(loadDashboard);
const WorkingGroups = lazy(loadWorkingGroups);
const Projects = lazy(loadProjects);
const Users = lazy(loadUsers);

const OnboardedApp: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  const user = useCurrentUserGP2();

  const [showWelcomeBackBanner, setShowWelcomeBackBanner] = useState(
    user?.onboarded || false,
  );

  useEffect(() => {
    // order by the likelyhood of user navigating there
    loadDashboard().then(loadUsers).then(loadWorkingGroups).then(loadProjects);
  });

  const { projects = [], workingGroups = [] } =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useUserById(user!.id) || {};

  return (
    <Layout projects={projects} workingGroups={workingGroups}>
      <Switch>
        <Route exact path={path}>
          <Frame title="Dashboard">
            <Dashboard
              showWelcomeBackBanner={showWelcomeBackBanner}
              dismissBanner={() => setShowWelcomeBackBanner(false)}
            />
          </Frame>
        </Route>
        <Route path={usersRoute.template}>
          <Frame title="Users">
            <Users />
          </Frame>
        </Route>
        <Route path={workingGroupsRoute.template}>
          <Frame title="Working Groups">
            <WorkingGroups />
          </Frame>
        </Route>
        <Route path={projectsRoute.template}>
          <Frame title="Projects">
            <Projects />
          </Frame>
        </Route>
        <Route>
          <Frame title="Not Found">
            <NotFoundPage />
          </Frame>
        </Route>
      </Switch>
    </Layout>
  );
};

export default OnboardedApp;
