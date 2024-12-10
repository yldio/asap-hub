import { FC, lazy, useEffect, useState } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
} from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

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
import { useIsComplianceReviewer, useManuscripts, useTeamById } from './state';
import TeamManuscript from './TeamManuscript';
import { EligibilityReasonProvider } from './EligibilityReasonProvider';
import TeamComplianceReport from './TeamComplianceReport';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');
const loadCompliance = () =>
  import(/* webpackChunkName: "network-team-compliance" */ './Compliance');
const loadTeamOutput = () =>
  import(/* webpackChunkName: "network-team-team-output" */ './TeamOutput');
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const Compliance = lazy(loadCompliance);
const TeamOutput = lazy(loadTeamOutput);

type TeamProfileProps = {
  currentTime: Date;
};

const DuplicateOutput: FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const { path } = useRouteMatch();
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);
  const { teamId } = useRouteParams(route);
  const team = useTeamById(teamId);
  const user = useCurrentUserCRN();
  const isStaff = user?.role === 'Staff';

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(team?.tools || isStaff ? loadWorkspace : undefined)
      .then(team?.displayName === 'ASAP' ? loadCompliance : undefined)
      .then(loadOutputs)
      .then(loadTeamOutput)
      .then(loadEventsList);
  }, [team, isStaff]);

  const canShareResearchOutput = useCanShareResearchOutput(
    'teams',
    [teamId],
    !team?.inactiveSince,
  );
  const canDuplicateResearchOutput = useCanDuplicateResearchOutput('teams', [
    teamId,
  ]);

  const canCreateComplianceReport = useIsComplianceReviewer();
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

  const manuscriptCount = useManuscripts({
    searchQuery: '',
    currentPage: 0,
    pageSize,
    filters: new Set(),
  });

  if (team) {
    const {
      about,
      compliance,
      createOutput,
      duplicateOutput,
      outputs,
      past,
      upcoming,
      workspace,
      draftOutputs,
    } = route({
      teamId,
    });
    const paths = {
      about: path + about.template,
      compliance: path + compliance.template,
      outputs: path + outputs.template,
      past: path + past.template,
      upcoming: path + upcoming.template,
      workspace: path + workspace.template,
      draftOutputs: path + draftOutputs.template,
    };

    const isAsapTeam = team.displayName === 'ASAP';

    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput, canDuplicateResearchOutput }}
      >
        <ManuscriptToastProvider>
          <EligibilityReasonProvider>
            <Switch>
              <Route
                path={workspace({}).$ + workspace({}).createManuscript.template}
              >
                <Frame title="Create Manuscript">
                  <TeamManuscript teamId={teamId} />
                </Frame>
              </Route>
              <Route
                path={workspace({}).$ + workspace({}).editManuscript.template}
              >
                <Frame title="Edit Manuscript">
                  <TeamManuscript teamId={teamId} />
                </Frame>
              </Route>
              <Route
                path={
                  workspace({}).$ + workspace({}).resubmitManuscript.template
                }
              >
                <Frame title="Resubmit Manuscript">
                  <TeamManuscript teamId={teamId} resubmitManuscript />
                </Frame>
              </Route>
              {canCreateComplianceReport && (
                <Route
                  path={
                    workspace({}).$ +
                    workspace({}).createComplianceReport.template
                  }
                >
                  <Frame title="Create Compliance Report">
                    <TeamComplianceReport teamId={teamId} />
                  </Frame>
                </Route>
              )}
              {canShareResearchOutput && (
                <Route path={path + createOutput.template}>
                  <Frame title="Share Output">
                    <TeamOutput teamId={teamId} />
                  </Frame>
                </Route>
              )}
              {canDuplicateResearchOutput && (
                <Route path={path + duplicateOutput.template}>
                  <Frame title="Duplicate Output">
                    <DuplicateOutput />
                  </Frame>
                </Route>
              )}
              <TeamProfilePage
                {...team}
                isStaff={isStaff}
                isAsapTeam={isAsapTeam}
                teamListElementId={teamListElementId}
                upcomingEventsCount={upcomingEvents?.total || 0}
                pastEventsCount={pastEvents?.total || 0}
                teamOutputsCount={teamOutputsResult.total}
                teamDraftOutputsCount={
                  canShareResearchOutput ? outputDraftResults.total : undefined
                }
                manuscriptsCount={manuscriptCount.total || 0}
              >
                <ProfileSwitch
                  About={() => (
                    <About teamListElementId={teamListElementId} team={team} />
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
                  {...(isAsapTeam ? { Compliance: () => <Compliance /> } : {})}
                />
              </TeamProfilePage>
            </Switch>
          </EligibilityReasonProvider>
        </ManuscriptToastProvider>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
