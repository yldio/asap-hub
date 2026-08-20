import { FC, lazy, useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { v4 as uuid } from 'uuid';

import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, TeamProfilePage } from '@asap-hub/react-components';
import {
  ResearchOutputPermissionsContext,
  useCurrentUserCRN,
  useFlags,
} from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

import { ASAP_TEAM_NAME } from '../../constants';
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
import { useIsComplianceReviewer, useTeamById } from './state';
import { EligibilityReasonProvider } from './EligibilityReasonProvider';

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
const loadComplianceReport = () =>
  import(
    /* webpackChunkName: "network-team-compliance-report" */ './TeamComplianceReport'
  );
const loadTeamManuscript = () =>
  import(/* webpackChunkName: "network-team-manuscript" */ './TeamManuscript');

const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const TeamOutput = lazy(loadTeamOutput);
const TeamComplianceReport = lazy(loadComplianceReport);
const TeamManuscript = lazy(loadTeamManuscript);
type TeamProfileProps = {
  currentTime: Date;
};

const DuplicateOutput: FC = () => {
  const { id } = useParams<{ id: string }>();
  const output = useResearchOutputById(id ?? '');
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
        isDuplicate
        teamId={output.teams[0].id}
      />
    );
  }
  return <NotFoundPage />;
};

const TeamProfile: FC<TeamProfileProps> = ({ currentTime }) => {
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);
  const { teamId } = useRouteParams(route);
  const team = useTeamById(teamId);
  const user = useCurrentUserCRN();
  const { isEnabled } = useFlags();
  const isProjectOutputsEnabled = isEnabled('PROJECT_OUTPUTS');

  const isStaff = user?.role === 'Staff';
  const isAsapTeam = team?.displayName === ASAP_TEAM_NAME;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(team?.tools || isStaff ? loadWorkspace : undefined)
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
    currentPage: 0,
    searchQuery: '',
    pageSize,
    teamId,
  });
  const outputDraftResults = useResearchOutputs({
    draftsOnly: true,
    userAssociationMember: canShareResearchOutput,
    currentPage: 0,
    searchQuery: '',
    pageSize,
    teamId,
  });

  if (team) {
    const { about, outputs, past, upcoming, workspace, draftOutputs } = route({
      teamId,
    });
    const paths = {
      about: about.template.replace(/^\//, ''),
      outputs: outputs.template.replace(/^\//, ''),
      past: past.template.replace(/^\//, ''),
      upcoming: upcoming.template.replace(/^\//, ''),
      workspace: workspace.template.replace(/^\//, ''),
      draftOutputs: draftOutputs.template.replace(/^\//, ''),
    };

    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput, canDuplicateResearchOutput }}
      >
        <ManuscriptToastProvider>
          <EligibilityReasonProvider>
            <Routes>
              <Route
                path={`${workspace.template.replace(/^\//, '')}${
                  workspace({}).createManuscript.template
                }`}
                element={
                  <Frame title="Create Manuscript">
                    <TeamManuscript teamId={teamId} />
                  </Frame>
                }
              />
              <Route
                path={`${workspace.template.replace(/^\//, '')}${
                  workspace({}).editManuscript.template
                }`}
                element={
                  <Frame title="Edit Manuscript">
                    <TeamManuscript teamId={teamId} />
                  </Frame>
                }
              />
              <Route
                path={`${workspace.template.replace(/^\//, '')}${
                  workspace({}).resubmitManuscript.template
                }`}
                element={
                  <Frame title="Resubmit Manuscript">
                    <TeamManuscript teamId={teamId} resubmitManuscript />
                  </Frame>
                }
              />
              {canCreateComplianceReport && (
                <Route
                  path={`${workspace.template.replace(/^\//, '')}${
                    workspace({}).createComplianceReport.template
                  }`}
                  element={
                    <Frame title="Create Compliance Report">
                      <TeamComplianceReport teamId={teamId} />
                    </Frame>
                  }
                />
              )}
              {canShareResearchOutput && !isProjectOutputsEnabled && (
                <Route
                  path="create-output/:outputDocumentType"
                  element={
                    <Frame title="Share Output">
                      <TeamOutput teamId={teamId} />
                    </Frame>
                  }
                />
              )}
              {canDuplicateResearchOutput && (
                <Route
                  path="duplicate/:id"
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
                    isStaff={isStaff}
                    isAsapTeam={isAsapTeam}
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
                          isAsapTeam={isAsapTeam}
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
                      Workspace={
                        <Workspace
                          team={{ ...team, tools: team.tools ?? [] }}
                        />
                      }
                    />
                  </TeamProfilePage>
                }
              />
            </Routes>
          </EligibilityReasonProvider>
        </ManuscriptToastProvider>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
