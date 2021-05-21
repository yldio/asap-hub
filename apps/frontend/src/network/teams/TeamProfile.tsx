import { useEffect, FC, lazy, useState } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { TeamProfilePage, NotFoundPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import { v4 as uuid } from 'uuid';

import { useTeamById } from './state';
import Frame from '../../structure/Frame';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
loadAbout();

const TeamProfile: FC<Record<string, never>> = () => {
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);

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
        <TeamProfilePage teamListElementId={teamListElementId} {...team}>
          <Switch>
            <Route path={path + route({ teamId }).about.template}>
              <Frame title="About">
                <About teamListElementId={teamListElementId} team={team} />
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
