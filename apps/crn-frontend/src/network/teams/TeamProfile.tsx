import { FC, lazy, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

import { usePaginationParams } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { useCanCreateUpdateResearchOutput, useTeamById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');
const loadTeamOutput = () =>
  import(/* webpackChunkName: "network-team-team-output" */ './TeamOutput');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const TeamOutput = lazy(loadTeamOutput);
loadAbout();

type TeamProfileProps = {
  currentTime: Date;
};

const TeamProfile: FC<TeamProfileProps> = ({ currentTime }) => {
  const { path } = useRouteMatch();
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);

  const { teamId } = useRouteParams(route);
  const team = useTeamById(teamId);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs)
      .then(loadTeamOutput)
      .then(loadEventsList);
  }, [team]);

  const canCreateUpdate = useCanCreateUpdateResearchOutput([teamId]);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    teamId,
  });

  const { pageSize } = usePaginationParams();
  const teamOutputsResult = useResearchOutputs({
    filters: new Set(),
    currentPage: 0,
    searchQuery: '',
    pageSize,
    teamId,
  });

  if (team) {
    const { about, createOutput, outputs, past, upcoming, workspace } = route({
      teamId,
    });
    const paths = {
      about: path + about.template,
      createOutput: path + createOutput.template,
      outputs: path + outputs.template,
      past: path + past.template,
      upcoming: path + upcoming.template,
      workspace: path + workspace.template,
    };

    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <TeamProfilePage
          teamListElementId={teamListElementId}
          upcomingEventsCount={upcomingEvents.total}
          pastEventsCount={pastEvents.total}
          teamOutputsCount={teamOutputsResult.total}
          {...team}
        >
          <ProfileSwitch
            About={() => (
              <About teamListElementId={teamListElementId} team={team} />
            )}
            currentTime={currentTime}
            displayName={team.displayName}
            eventConstraint={{ teamId }}
            isActive={!team?.inactiveSince}
            Outputs={() => <Outputs team={team} />}
            paths={paths}
            ShareOutput={() => <TeamOutput teamId={teamId} />}
            type="team"
            Workspace={() => (
              <Workspace team={{ ...team, tools: team.tools ?? [] }} />
            )}
          />
        </TeamProfilePage>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
