import { useEffect, FC, lazy, useState } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import {
  TeamProfilePage,
  NotFoundPage,
  TeamProfileOutputsHeader,
} from '@asap-hub/react-components';

import { network, useRouteParams } from '@asap-hub/routing';
import { isEnabled } from '@asap-hub/flags';
import { v4 as uuid } from 'uuid';

import { useTeamById } from './state';
import Frame, { SearchFrame } from '../../structure/Frame';
import { useSearch } from '../../hooks';

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
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();
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
              {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') && (
                <TeamProfileOutputsHeader
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                  onChangeFilter={toggleFilter}
                  filters={filters}
                />
              )}
              <SearchFrame title="Outputs">
                <Outputs
                  teamId={teamId}
                  searchQuery={debouncedSearchQuery}
                  filters={filters}
                  teamOutputs={team.outputs}
                />
              </SearchFrame>
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
