import React, { useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { TeamProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

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
  const route = network({}).teams({}).team;
  const { path } = useRouteMatch();
  const { teamId } = useRouteParams(route);

  const team = useTeamById(teamId);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs);
  }, [team]);

  if (team) {
    return (
      <TeamProfilePage {...team}>
        <Frame>
          <Switch>
            <Route path={path + route({ teamId }).about.template}>
              <About team={team} />
            </Route>
            <Route path={path + route({ teamId }).outputs.template}>
              <Outputs outputs={team.outputs} />
            </Route>
            {team.tools && (
              <Route path={path + route({ teamId }).workspace.template}>
                <Workspace team={{ ...team, tools: team.tools }} />
              </Route>
            )}
            <Redirect to={route({ teamId }).about({}).$} />
          </Switch>
        </Frame>
      </TeamProfilePage>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
