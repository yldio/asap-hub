import { Frame } from '@asap-hub/frontend-utils';
import { Layout } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { useAuth0, useCurrentUser } from '@asap-hub/react-context';
import { gp2 } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { auth0State } from './auth/state';

const { workingGroups, users, projects } = gp2;
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

const AuthenticatedApp: FC<Record<string, never>> = () => {
  const auth0 = useAuth0();
  const [recoilAuth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  const { path } = useRouteMatch();

  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);
  const user = useCurrentUser();

  useEffect(() => {
    // order by the likelyhood of user navigating there
    loadDashboard().then(loadUsers).then(loadWorkingGroups).then(loadProjects);
  }, []);

  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  return (
    <Layout>
      <Switch>
        <Route exact path={path}>
          <Frame title="Dashboard">
            <Dashboard />
          </Frame>
        </Route>
        <Route path={users.template}>
          <Frame title="Users">
            <Users />
          </Frame>
        </Route>
        <Route path={workingGroups.template}>
          <Frame title="Working Groups">
            <WorkingGroups />
          </Frame>
        </Route>
        <Route path={projects.template}>
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

export default AuthenticatedApp;
