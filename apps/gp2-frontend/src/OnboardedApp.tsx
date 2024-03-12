import { Layout } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Route } from '@asap-hub/routing';

import { FC, lazy, useEffect } from 'react';
import { Route, Routes, useRouteMatch } from 'react-router-dom';
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
  const { path } = useRouteMatch();

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
        <Route exact path={path}>
          <Frame title="Dashboard">
            <Dashboard />
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
        <Route path={eventsRoute.template}>
          <Frame title="Events">
            <Events />
          </Frame>
        </Route>
        <Route path={outputsRoute.template}>
          <Frame title="Outputs">
            <Outputs />
          </Frame>
        </Route>
        <Route path={newsRoute.template}>
          <Frame title="News">
            <News />
          </Frame>
        </Route>
        <Route path={tagsRoute.template}>
          <Frame title="Tags">
            <Tags />
          </Frame>
        </Route>

        <Route>
          <Frame title="Not Found">
            <NotFoundPage />
          </Frame>
        </Route>
      </Routes>
    </Layout>
  );
};

export default OnboardedApp;
