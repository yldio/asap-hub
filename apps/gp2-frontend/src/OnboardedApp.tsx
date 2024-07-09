import { Layout } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { dashboardRoutes, gp2 as gp2Route } from '@asap-hub/routing';

import { FC, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Frame from './Frame';
import { useUserById } from './users/state';

const {
  workingGroups: workingGroupsRoute,
  users: usersRoute,
  projects: projectsRoute,
  events: eventsRoute,
  outputs: outputsRoute,
  newsList: newsRoute,
  tags: tagsRoute,
} = gp2Route;
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');

const loadWorkingGroups = () =>
  import(/* webpackChunkName: "working-groups" */ './working-groups/Routes');

const loadProjects = () =>
  import(/* webpackChunkName: "projects" */ './projects/Routes');

const loadUsers = () =>
  import(/* webpackChunkName: "users" */ './users/Routes');

const loadEvents = () =>
  import(/* webpackChunkName: "events" */ './events/Routes');

const loadOutputs = () =>
  import(/* webpackChunkName: "outputs" */ './outputs/Routes');

const loadNews = () => import(/* webpackChunkName: "news" */ './news/Routes');

const loadTags = () => import(/* webpackChunkName: "tags" */ './tags/Routes');

const Dashboard = lazy(loadDashboard);
const WorkingGroups = lazy(loadWorkingGroups);
const Projects = lazy(loadProjects);
const Users = lazy(loadUsers);
const Events = lazy(loadEvents);
const Outputs = lazy(loadOutputs);
const News = lazy(loadNews);
const Tags = lazy(loadTags);

const OnboardedApp: FC<Record<string, never>> = () => {
  // const { path } = useMatch();

  const user = useCurrentUserGP2();

  useEffect(() => {
    // order by the likelyhood of user navigating there
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadDashboard()
      .then(loadUsers)
      .then(loadWorkingGroups)
      .then(loadProjects)
      .then(loadEvents)
      .then(loadOutputs)
      .then(loadNews)
      .then(loadTags);
  });

  const { projects = [], workingGroups = [] } =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useUserById(user!.id) || {};

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <Layout userId={user!.id} projects={projects} workingGroups={workingGroups}>
      <Routes>
        <Route
          path={dashboardRoutes.DEFAULT.path}
          element={
            <Frame title="Dashboard">
              <Dashboard />
            </Frame>
          }
        />
        <Route
          path={usersRoute.DEFAULT.path}
          element={
            <Frame title="Users">
              <Users />
            </Frame>
          }
        />
        <Route
          path={workingGroupsRoute.DEFAULT.path}
          element={
            <Frame title="Working Groups">
              <WorkingGroups />
            </Frame>
          }
        />
        <Route
          path={projectsRoute.DEFAULT.path}
          element={
            <Frame title="Projects">
              <Projects />
            </Frame>
          }
        />
        <Route
          path={eventsRoute.DEFAULT.path}
          element={
            <Frame title="Events">
              <Events />
            </Frame>
          }
        />
        <Route
          path={outputsRoute.DEFAULT.path}
          element={
            <Frame title="Outputs">
              <Outputs />
            </Frame>
          }
        />
        <Route
          path={newsRoute.DEFAULT.path}
          element={
            <Frame title="News">
              <News />
            </Frame>
          }
        />
        <Route
          path={tagsRoute.path}
          element={
            <Frame title="Tags">
              <Tags />
            </Frame>
          }
        />
        <Route
          path="*"
          element={
            <Frame title="Not Found">
              <NotFoundPage />
            </Frame>
          }
        />
      </Routes>
    </Layout>
  );
};

export default OnboardedApp;
