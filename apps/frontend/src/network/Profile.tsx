import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { join } from 'path';
import {
  Paragraph,
  ProfilePage,
  ProfileAbout,
  ProfileResearch,
  ProfileOutputs,
  NotFoundPage,
  ErrorCard,
} from '@asap-hub/react-components';

import { useUserById } from '../api';

const Profile: React.FC<{}> = () => {
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
        <ErrorBoundary FallbackComponent={ErrorCard}>
          <Switch>
            <Route path={`${path}/about`}>
              <ProfileAbout {...profile} />
            </Route>
            <Route path={`${path}/research`}>
              <ProfileResearch {...profile} />
            </Route>
            <Route path={`${path}/outputs`}>
              <ProfileOutputs />
            </Route>

            <Redirect to={join(url, 'research')} />
          </Switch>
        </ErrorBoundary>
      </ProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default Profile;
