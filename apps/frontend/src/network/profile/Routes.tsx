import React, { Suspense, useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  Paragraph,
  ProfilePage,
  NotFoundPage,
} from '@asap-hub/react-components';

import { useUserById } from '@asap-hub/frontend/src/api/users';
import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';

const loadResearch = () =>
  import(/* webpackChunkName: "network-profile-research" */ './Research');
const loadAbout = () =>
  import(/* webpackChunkName: "network-profile-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-profile-outputs" */ './Outputs');
const Research = React.lazy(loadResearch);
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
loadResearch();

const Profile: React.FC<{}> = () => {
  useEffect(() => {
    loadResearch().then(loadAbout).then(loadOutputs);
  }, []);

  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();

  const { loading, data: profile } = useUserById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (profile) {
    const profilePageProps = {
      ...profile,

      teams: profile.teams.map((team) => ({
        ...team,
        href: `/network/teams/${team.id}`,
      })),

      aboutHref: join(url, 'about'),
      researchHref: join(url, 'research'),
      outputsHref: join(url, 'outputs'),
    };

    return (
      <ProfilePage {...profilePageProps}>
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            <Switch>
              <Route path={`${path}/research`}>
                <Research {...profile} />
              </Route>
              <Route path={`${path}/about`}>
                <About {...profile} />
              </Route>
              <Route path={`${path}/outputs`}>
                <Outputs />
              </Route>

              <Redirect to={join(url, 'research')} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </ProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default Profile;
