import { SkeletonHeaderFrame as Frame } from '@asap-hub/frontend-utils';
import { Layout, Loading, NotFoundPage } from '@asap-hub/react-components';
import {
  useAuth0CRN,
  useCurrentUserCRN,
  useFlags,
} from '@asap-hub/react-context';
import {
  about,
  analytics,
  dashboard,
  discover,
  events,
  network,
  news,
  projects,
  sharedResearch,
  tags,
} from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { RecoilRoot, useRecoilState, useResetRecoilState } from 'recoil';

import CheckOnboarded from './auth/CheckOnboarded';
import { auth0State } from './auth/state';
import { useCurrentUserProfileTabRoute } from './hooks';
import Onboardable from './Onboardable';

const loadNews = () => import(/* webpackChunkName: "news" */ './news/Routes');
const loadNetwork = () =>
  import(/* webpackChunkName: "network" */ './network/Network');
const loadSharedResearch = () =>
  import(/* webpackChunkName: "shared-research" */ './shared-research/Routes');
const loadDashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './dashboard/Dashboard');
const loadDiscover = () =>
  import(/* webpackChunkName: "discover" */ './discover/Routes');
const loadEvents = () =>
  import(/* webpackChunkName: "events" */ './events/Events');
const loadTags = () => import(/* webpackChunkName: "tags" */ './tags/Routes');

const loadAbout = () =>
  import(/* webpackChunkName: "about" */ './about/Routes');

const loadAnalytics = () =>
  import(/* webpackChunkName: "analytics" */ './analytics/Routes');
const loadProjects = () =>
  import(/* webpackChunkName: "projects" */ './projects/Projects');

const News = lazy(loadNews);
const Network = lazy(loadNetwork);
const SharedResearch = lazy(loadSharedResearch);
const Dashboard = lazy(loadDashboard);
const Discover = lazy(loadDiscover);
const Events = lazy(loadEvents);
const About = lazy(loadAbout);
const Analytics = lazy(loadAnalytics);
const Tags = lazy(loadTags);
const Projects = lazy(loadProjects);

const AuthenticatedApp: FC<{
  setIsOnboardable?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsOnboardable }) => {
  const auth0 = useAuth0CRN();
  const [recoilAuth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);

  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);

  useEffect(() => {
    // order by the likelyhood of user navigating there
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadDashboard()
      .then(loadNews)
      .then(loadNetwork)
      .then(loadSharedResearch)
      .then(loadProjects)
      .then(loadDiscover)
      .then(loadAbout)
      .then(loadAnalytics)
      .then(loadEvents)
      .then(loadTags);
  }, []);

  const user = useCurrentUserCRN();
  const tabRoute = useCurrentUserProfileTabRoute();
  const { isEnabled } = useFlags();
  const canViewAnalytics = user?.role === 'Staff';
  const canViewProjects = isEnabled('PROJECTS_MVP');
  if (!user || !recoilAuth0) {
    return <Loading />;
  }

  return (
    <Onboardable>
      {(onboardable) => {
        if (setIsOnboardable) {
          setIsOnboardable(Boolean(onboardable));
        }
        return (
          <Layout
            userOnboarded={user.onboarded}
            onboardable={onboardable}
            canViewAnalytics={canViewAnalytics}
            canViewProjects={canViewProjects}
            onboardModalHref={
              tabRoute ? tabRoute({}).editOnboarded({}).$ : undefined
            }
            userProfileHref={network({}).users({}).user({ userId: user.id }).$}
            firstName={user.firstName}
            lastName={user.lastName}
            displayName={user.displayName}
            avatarUrl={user.avatarUrl}
            teams={user.teams.map(({ id, displayName = '' }) => ({
              name: displayName,
              href: network({}).teams({}).team({ teamId: id }).$,
            }))}
            workingGroups={user.workingGroups.map(
              ({ id, name = '', active }) => ({
                name,
                active,
                href: network({})
                  .workingGroups({})
                  .workingGroup({ workingGroupId: id }).$,
              }),
            )}
            interestGroups={user.interestGroups.map(
              ({ id, name = '', active }) => ({
                name,
                active,
                href: network({})
                  .interestGroups({})
                  .interestGroup({ interestGroupId: id }).$,
              }),
            )}
            aboutHref="https://www.parkinsonsroadmap.org/"
          >
            <CheckOnboarded>
              <Switch>
                <Route
                  exact
                  path={[
                    dashboard.template,
                    dashboard({}).dismissGettingStarted({}).$,
                  ]}
                >
                  <Frame title="Dashboard">
                    <Dashboard />
                  </Frame>
                </Route>
                <Route path={discover.template}>
                  <Frame title="Guides & Tutorials">
                    <Discover />
                  </Frame>
                </Route>
                <Route path={about.template}>
                  <Frame title="About ASAP">
                    <About />
                  </Frame>
                </Route>
                {canViewAnalytics && (
                  <Route path={analytics.template}>
                    <Frame title="Analytics">
                      <Analytics />
                    </Frame>
                  </Route>
                )}
                <Route path={news.template}>
                  <Frame title="News">
                    <News />
                  </Frame>
                </Route>
                <Route path={network.template}>
                  <Frame title={null}>
                    <Network />
                  </Frame>
                </Route>
                <Route path={sharedResearch.template}>
                  <Frame title="Shared Research">
                    <SharedResearch />
                  </Frame>
                </Route>
                {canViewProjects && (
                  <Route path={projects.template}>
                    <Frame title={null}>
                      <Projects />
                    </Frame>
                  </Route>
                )}
                <Route path={events.template}>
                  <Frame title={null}>
                    <Events />
                  </Frame>
                </Route>
                <Route path={tags.template}>
                  <Frame title="Tags">
                    <Tags />
                  </Frame>
                </Route>

                <Route>
                  <Frame title="Not Found">
                    <NotFoundPage />
                  </Frame>
                </Route>
              </Switch>
            </CheckOnboarded>
          </Layout>
        );
      }}
    </Onboardable>
  );
};
const AuthenticatedAppWithRecoil: FC<
  Record<string, React.Dispatch<React.SetStateAction<boolean>> | never>
> = ({ setIsOnboardable }) => (
  <RecoilRoot>
    <AuthenticatedApp setIsOnboardable={setIsOnboardable} />
  </RecoilRoot>
);

export default AuthenticatedAppWithRecoil;
