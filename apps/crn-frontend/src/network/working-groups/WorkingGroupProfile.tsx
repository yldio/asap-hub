import { FC, lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { Frame } from '@asap-hub/frontend-utils';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { NotFoundPage, WorkingGroupPage } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

import { usePaginationParams } from '../../hooks';
import {
  useResearchOutputs,
  useCanShareResearchOutput,
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
loadAbout();

type WorkingGroupProfileProps = {
  currentTime: Date;
};
const WorkingGroupProfile: FC<WorkingGroupProfileProps> = ({ currentTime }) => {
  const { path } = useRouteMatch();
  const route = network({}).workingGroups({}).workingGroup;
  const [membersListElementId] = useState(`wg-members-${uuid()}`);

  const { workingGroupId } = useRouteParams(route);
  const workingGroup = useWorkingGroupById(workingGroupId);

  const canShareResearchOutput = useCanShareResearchOutput('workingGroups', [
    workingGroupId,
  ]);

  useEffect(() => {
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
    const {
      about,
      calendar,
      createOutput,
      outputs,
      draftOutputs,
      past,
      upcoming,
    } = route({
      workingGroupId,
    });
    const paths = {
      about: path + about.template,
      calendar: path + calendar.template,
      outputs: path + outputs.template,
      past: path + past.template,
      upcoming: path + upcoming.template,
      draftOutputs: path + draftOutputs.template,
    };
    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canShareResearchOutput }}
      >
        <Switch>
          <Route path={path + createOutput.template}>
            <Frame title="Share Output">
              <WorkingGroupOutput workingGroupId={workingGroupId} />
            </Frame>
          </Route>
          <WorkingGroupPage
            upcomingEventsCount={upcomingEventsResult.total}
            pastEventsCount={pastEventsResult.total}
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
        </Switch>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
