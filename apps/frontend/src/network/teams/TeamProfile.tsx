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
      <Frame title={team.displayName}>
        <TeamProfilePage {...team}>
          <Switch>
            <Route path={path + route({ teamId }).about.template}>
              <Frame title="About">
                <About team={team} />
              </Frame>
            </Route>
            <Route path={path + route({ teamId }).outputs.template}>
              <Frame title="Outputs">
                <Outputs outputs={team.outputs} />
              </Frame>
            </Route>
            {team.tools && (
              <Route path={path + route({ teamId }).workspace.template}>
                <Frame title="Workspace">
                  <Workspace team={{ ...team, tools: team.tools }} />
                </Frame>
              </Route>
            )}
            <Redirect to={route({ teamId }).about({}).$} />
          </Switch>
        </TeamProfilePage>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
