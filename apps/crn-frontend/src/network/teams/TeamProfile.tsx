import { FC, lazy, useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
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
import { EligibilityReasonProvider } from './EligibilityReasonProvider';

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
const loadComplianceReport = () =>
  import(
    /* webpackChunkName: "network-team-compliance-report" */ './TeamComplianceReport'
  );
const loadTeamManuscript = () =>
  import(/* webpackChunkName: "network-team-manuscript" */ './TeamManuscript');

const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const Compliance = lazy(loadCompliance);
const TeamOutput = lazy(loadTeamOutput);
const TeamComplianceReport = lazy(loadComplianceReport);
const TeamManuscript = lazy(loadTeamManuscript);
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
  const isStaff = user?.role === 'Staff';
  const isAsapTeam = team?.displayName === 'ASAP';
  const canDisplayCompliancePage = isStaff && isAsapTeam;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(team?.tools || isStaff ? loadWorkspace : undefined)
      .then(canDisplayCompliancePage ? loadCompliance : undefined)
      .then(loadOutputs)
      .then(loadTeamOutput)
      .then(loadEventsList);
  }, [team, isStaff, canDisplayCompliancePage]);

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
    requestedAPCCoverage: 'all',
    completedStatus: 'hide',
    selectedStatuses: [],
  });

  if (team) {
    const paths = {
      about: 'about',
      compliance: 'compliance',
      outputs: 'outputs',
      past: 'past',
      upcoming: 'upcoming',
      workspace: 'workspace',
      draftOutputs: 'draft-outputs',
    };

    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput, canDuplicateResearchOutput }}
      >
        <ManuscriptToastProvider>
          <EligibilityReasonProvider>
            <Routes>
              <Route
                path="workspace/create-manuscript"
                element={
                  <Frame title="Create Manuscript">
                    <TeamManuscript teamId={teamId} />
                  </Frame>
                }
              />
              <Route
                path="workspace/edit-manuscript/:manuscriptId"
                element={
                  <Frame title="Edit Manuscript">
                    <TeamManuscript teamId={teamId} />
                  </Frame>
                }
              />
              <Route
                path="workspace/resubmit-manuscript/:manuscriptVersionId"
                element={
                  <Frame title="Resubmit Manuscript">
                    <TeamManuscript teamId={teamId} resubmitManuscript />
                  </Frame>
                }
              />
              {canCreateComplianceReport && (
                <Route
                  path="workspace/create-compliance-report"
                  element={
                    <Frame title="Create Compliance Report">
                      <TeamComplianceReport teamId={teamId} />
                    </Frame>
                  }
                />
              )}
              {canShareResearchOutput && (
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
                    manuscriptsCount={manuscriptCount.total || 0}
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
                        <Workspace
                          team={{ ...team, tools: team.tools ?? [] }}
                        />
                      )}
                      {...(canDisplayCompliancePage
                        ? { Compliance: <Compliance /> }
                        : {})}
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
