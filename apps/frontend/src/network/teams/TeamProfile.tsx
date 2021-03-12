import React, { useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { TeamProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { join } from 'path';

import { useTeamById } from './state';
import Frame from '../../structure/Frame';

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

const TeamProfile: React.FC<Record<string, never>> = () => {
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch<{ id: string }>();

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
        <Frame>
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
        </Frame>
      </TeamProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
