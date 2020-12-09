import React, { Suspense, useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import {
  TeamProfilePage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { join } from 'path';

import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';
import { useTeamById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
const Workspace = React.lazy(loadWorkspace);
loadAbout();

const TeamProfile: React.FC<{}> = () => {
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();

  const team = useTeamById(id);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs);
  }, [team]);

  if (team) {
    const teamPageProps = {
      ...team,
      aboutHref: join(url, 'about'),
      outputsHref: join(url, 'outputs'),
      workspaceHref: join(url, 'workspace'),
    };

    return (
      <TeamProfilePage {...teamPageProps}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path={`${path}/about`}>
                <About team={team} />
              </Route>
              <Route path={`${path}/outputs`}>
                <Outputs outputs={team.outputs} />
              </Route>
              {team.tools && (
                <Route path={`${path}/workspace`}>
                  <Workspace team={{ ...team, tools: team.tools }} />
                </Route>
              )}
              <Redirect to={join(url, 'about')} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </TeamProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
