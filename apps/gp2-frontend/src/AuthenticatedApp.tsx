import { Auth0, gp2 as gp2Auth } from '@asap-hub/auth';
import { Frame } from '@asap-hub/frontend-utils';
import { BasicLayout, Layout } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { useAuth0GP2, useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Route } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { RecoilRoot, useRecoilState, useResetRecoilState } from 'recoil';
import { auth0State } from './auth/state';

const { workingGroups, users, projects } = gp2Route;
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "working-groups" */ './working-groups/Routes');

const loadProjects = () =>
  import(/* webpackChunkName: "projects" */ './projects/Routes');

const loadUsers = () =>
  import(/* webpackChunkName: "users" */ './users/Routes');
const loadOnboarding = () =>
  import(/* webpackChunkName: "onboarding" */ './onboarding/Routes');

const Dashboard = lazy(loadDashboard);
const WorkingGroups = lazy(loadWorkingGroups);
const Projects = lazy(loadProjects);
const Users = lazy(loadUsers);
const Onboarding = lazy(loadOnboarding);

const AuthenticatedApp: FC<Record<string, never>> = () => {
  const auth0 = useAuth0GP2();
  const [recoilAuth0, setAuth0] = useRecoilState<
    Auth0<gp2Auth.User> | undefined
  >(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  const { path } = useRouteMatch();

  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);
  const user = useCurrentUserGP2();

  useEffect(() => {
    // order by the likelyhood of user navigating there
    user?.onboarded
      ? loadDashboard()
          .then(loadUsers)
          .then(loadWorkingGroups)
          .then(loadProjects)
      : loadOnboarding();
  }, [user?.onboarded]);

  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  if (!user.onboarded) {
    return (
      <BasicLayout>
        <Switch>
          <Route path={path}>
            <Onboarding />
          </Route>
          <Route>
            <Frame title="Not Found">
              <NotFoundPage />
            </Frame>
          </Route>
        </Switch>
      </BasicLayout>
    );
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

const AuthenticatedAppWithRecoil: FC<Record<string, never>> = () => (
  <RecoilRoot>
    <AuthenticatedApp />
  </RecoilRoot>
);

export default AuthenticatedAppWithRecoil;
