import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, WorkingGroupPage } from '@asap-hub/react-components';
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

import { useWorkingGroupById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-working-group-about" */ './About');
const loadCalendar = () =>
  import(/* webpackChunkName: "network-working-group-calendar" */ './Calendar');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-working-group-outputs" */ './Outputs');
const loadWorkingGroupOutput = () =>
  import(
    /* webpackChunkName: "network-working-group-output" */ './WorkingGroupOutput'
  );

const About = lazy(loadAbout);
const Calendar = lazy(loadCalendar);
const Outputs = lazy(loadOutputs);
const WorkingGroupOutput = lazy(loadWorkingGroupOutput);

const DuplicateOutput: FC = () => {
  const { id } = useTypedParams(
    networkRoutes.DEFAULT.WORKING_GROUPS.DETAILS.DUPLICATE_OUTPUT,
  );
  const output = useResearchOutputById(id);

  if (output && output.workingGroups?.[0]?.id) {
    return (
      <WorkingGroupOutput
        researchOutputData={{
          ...output,
          id: '',
          published: false,
          link: undefined,
          title: `Copy of ${output.title}`,
        }}
        workingGroupId={output.workingGroups[0].id}
        descriptionUnchangedWarning
      />
    );
  }
  return <NotFoundPage />;
};

type WorkingGroupProfileProps = {
  currentTime: Date;
};
const WorkingGroupProfile: FC<WorkingGroupProfileProps> = ({ currentTime }) => {
  const route = networkRoutes.DEFAULT.WORKING_GROUPS.DETAILS;
  const { workingGroupId } = useTypedParams(route);
  const [membersListElementId] = useState(`wg-members-${uuid()}`);

  const workingGroup = useWorkingGroupById(workingGroupId);

  const canShareResearchOutput = useCanShareResearchOutput(
    'workingGroups',
    [workingGroupId],
    !workingGroup?.complete,
  );
  const canDuplicateResearchOutput = useCanDuplicateResearchOutput(
    'workingGroups',
    [workingGroupId],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout()
      .then(loadCalendar)
      .then(loadOutputs)
      .then(loadWorkingGroupOutput);
  }, []);

  const [upcomingEventsResult, pastEventsResult] = useUpcomingAndPastEvents(
    currentTime,
    { workingGroupId },
  );
  const { pageSize } = usePaginationParams();

  const outputResults = useResearchOutputs({
    filters: new Set(),
    currentPage: 0,
    searchQuery: '',
    pageSize,
    workingGroupId,
  });
  const outputDraftResults = useResearchOutputs({
    filters: new Set(),
    draftsOnly: true,
    userAssociationMember: canShareResearchOutput,
    currentPage: 0,
    searchQuery: '',
    pageSize,
    workingGroupId,
  });

  if (workingGroup) {
    const workingGroupDetailsRoutes =
      networkRoutes.DEFAULT.$.WORKING_GROUPS.$.DETAILS.$;

    const paths = {
      about: workingGroupDetailsRoutes.ABOUT.relativePath,
      calendar: workingGroupDetailsRoutes.CALENDAR.relativePath,
      outputs: workingGroupDetailsRoutes.OUTPUTS.relativePath,
      past: workingGroupDetailsRoutes.PAST.relativePath,
      upcoming: workingGroupDetailsRoutes.UPCOMING.relativePath,
      draftOutputs: workingGroupDetailsRoutes.DRAFT_OUTPUTS.relativePath,
    };

    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput, canDuplicateResearchOutput }}
      >
        <Routes>
          {canShareResearchOutput && (
            <Route
              path={workingGroupDetailsRoutes.CREATE_OUTPUT.relativePath}
              element={
                <Frame title="Share Output">
                  <WorkingGroupOutput workingGroupId={workingGroupId} />
                </Frame>
              }
            />
          )}
          {canDuplicateResearchOutput && (
            <Route
              path={workingGroupDetailsRoutes.DUPLICATE_OUTPUT.relativePath}
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
              <WorkingGroupPage
                upcomingEventsCount={upcomingEventsResult?.total || 0}
                pastEventsCount={pastEventsResult?.total || 0}
                membersListElementId={membersListElementId}
                workingGroupsDraftOutputsCount={
                  canShareResearchOutput ? outputDraftResults.total : undefined
                }
                workingGroupsOutputsCount={outputResults.total}
                {...workingGroup}
              >
                <ProfileSwitch
                  About={() => (
                    <About
                      showCollaborationCard={
                        !canShareResearchOutput && !workingGroup.complete
                      }
                      membersListElementId={membersListElementId}
                      workingGroup={workingGroup}
                    />
                  )}
                  Calendar={() => (
                    <Calendar
                      calendars={workingGroup.calendars}
                      groupType="working"
                    />
                  )}
                  DraftOutputs={
                    <Outputs
                      workingGroup={workingGroup}
                      draftOutputs
                      userAssociationMember={canShareResearchOutput}
                    />
                  }
                  currentTime={currentTime}
                  displayName={workingGroup.title}
                  eventConstraint={{ workingGroupId }}
                  isActive={!workingGroup.complete}
                  Outputs={
                    <Outputs
                      userAssociationMember={canShareResearchOutput}
                      workingGroup={workingGroup}
                    />
                  }
                  paths={paths}
                  type="working group"
                />
              </WorkingGroupPage>
            }
          />
        </Routes>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
