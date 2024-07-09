import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { networkRoutes } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { v4 as uuid } from 'uuid';

import { usePaginationParams } from '../../hooks';
import {
  useCanDuplicateResearchOutput,
  useCanShareResearchOutput,
  useResearchOutputById,
  useResearchOutputs,
} from '../../shared-research/state';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { ManuscriptToastProvider } from './ManuscriptToastProvider';
import { useTeamById } from './state';
import TeamManuscript from './TeamManuscript';

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

type TeamProfileProps = {
  currentTime: Date;
};

const DuplicateOutput: FC = () => {
  const { id } = useTypedParams(
    networkRoutes.DEFAULT.TEAMS.DETAILS.DUPLICATE_OUTPUT,
  );
  const output = useResearchOutputById(id);

  if (output && output.teams[0]?.id) {
    return (
      <TeamOutput
        researchOutputData={{
          ...output,
          id: '',
          published: false,
          link: undefined,
          title: `Copy of ${output.title}`,
        }}
        descriptionUnchangedWarning
        teamId={output.teams[0].id}
      />
    );
  }
  return <NotFoundPage />;
};

const TeamProfile: FC<TeamProfileProps> = ({ currentTime }) => {
  const route = networkRoutes.DEFAULT.TEAMS.DETAILS;
  const { teamId } = useTypedParams(route);
  const [teamListElementId] = useState(`team-list-${uuid()}`);

  const team = useTeamById(teamId);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs)
      .then(loadTeamOutput)
      .then(loadEventsList);
  }, [team]);

  const canShareResearchOutput = useCanShareResearchOutput(
    'teams',
    [teamId],
    !team?.inactiveSince,
  );
  const canDuplicateResearchOutput = useCanDuplicateResearchOutput('teams', [
    teamId,
  ]);
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
  const outputDraftResults = useResearchOutputs({
    filters: new Set(),
    draftsOnly: true,
    userAssociationMember: canShareResearchOutput,
    currentPage: 0,
    searchQuery: '',
    pageSize,
    teamId,
  });

  if (team) {
    const teamDetailsRoutes = networkRoutes.DEFAULT.$.TEAMS.$.DETAILS.$;
    const paths = {
      about: teamDetailsRoutes.ABOUT.relativePath,
      outputs: teamDetailsRoutes.OUTPUTS.relativePath,
      past: teamDetailsRoutes.PAST.relativePath,
      upcoming: teamDetailsRoutes.UPCOMING.relativePath,
      workspace: teamDetailsRoutes.WORKSPACE.relativePath,
      draftOutputs: teamDetailsRoutes.DRAFT_OUTPUTS.relativePath,
    };

    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput, canDuplicateResearchOutput }}
      >
        <ManuscriptToastProvider>
          <Routes>
            <Route
              path={teamDetailsRoutes.WORKSPACE.CREATE_MANUSCRIPT.relativePath}
              element={
                <Frame title="Create Manuscript">
                  <TeamManuscript teamId={teamId} />
                </Frame>
              }
            />

            {canShareResearchOutput && (
              <Route
                path={teamDetailsRoutes.CREATE_OUTPUT.relativePath}
                element={
                  <Frame title="Share Output">
                    <TeamOutput teamId={teamId} />
                  </Frame>
                }
              />
            )}
            {canDuplicateResearchOutput && (
              <Route
                path={teamDetailsRoutes.DUPLICATE_OUTPUT.path}
                element={
                  <Frame title="Duplicate Output">
                    <DuplicateOutput />
                  </Frame>
                }
              />
            )}
            <Route
              path="*"
              element={
                <TeamProfilePage
                  {...team}
                  teamListElementId={teamListElementId}
                  upcomingEventsCount={upcomingEvents?.total || 0}
                  pastEventsCount={pastEvents?.total || 0}
                  teamOutputsCount={teamOutputsResult.total}
                  teamDraftOutputsCount={
                    canShareResearchOutput
                      ? outputDraftResults.total
                      : undefined
                  }
                >
                  <ProfileSwitch
                    About={() => (
                      <About
                        teamListElementId={teamListElementId}
                        team={team}
                      />
                    )}
                    currentTime={currentTime}
                    displayName={team.displayName}
                    eventConstraint={{ teamId }}
                    isActive={!team?.inactiveSince}
                    Outputs={
                      <Outputs
                        userAssociationMember={canShareResearchOutput}
                        team={team}
                      />
                    }
                    DraftOutputs={
                      <Outputs
                        team={team}
                        draftOutputs
                        userAssociationMember={canShareResearchOutput}
                      />
                    }
                    paths={paths}
                    type="team"
                    Workspace={() => (
                      <Workspace team={{ ...team, tools: team.tools ?? [] }} />
                    )}
                  />
                </TeamProfilePage>
              }
            />
          </Routes>
        </ManuscriptToastProvider>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
