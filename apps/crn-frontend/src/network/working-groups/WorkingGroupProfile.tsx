import { FC, lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, WorkingGroupPage } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

import { usePaginationParams } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

import { useUpcomingAndPastEvents } from '../events';
import ProfileSwitch from '../ProfileSwitch';

import { useCanCreateUpdateResearchOutput, useWorkingGroupById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-working-group-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-working-group-outputs" */ './Outputs');
const loadWorkingGroupOutput = () =>
  import(
    /* webpackChunkName: "network-working-group-output" */ './WorkingGroupOutput'
  );

const About = lazy(loadAbout);
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

  const canCreateUpdate = useCanCreateUpdateResearchOutput(workingGroup);

  useEffect(() => {
    loadAbout().then(loadOutputs).then(loadWorkingGroupOutput);
  }, []);

  const [upcomingEventsResult, pastEventsResult] = useUpcomingAndPastEvents(
    currentTime,
    { workingGroupId },
  );
  const { pageSize } = usePaginationParams();

  useResearchOutputs({
    filters: new Set(),
    currentPage: 0,
    searchQuery: '',
    pageSize,
    workingGroupId,
  });

  if (workingGroup) {
    const { about, createOutput, outputs, past, upcoming } = route({
      workingGroupId,
    });
    const paths = {
      about: path + about.template,
      outputs: path + outputs.template,
      past: path + past.template,
      upcoming: path + upcoming.template,
    };
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
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
            {...workingGroup}
          >
            <ProfileSwitch
              About={() => (
                <About
                  membersListElementId={membersListElementId}
                  workingGroup={workingGroup}
                />
              )}
              currentTime={currentTime}
              displayName={workingGroup.title}
              eventConstraint={{ workingGroupId }}
              isActive={!workingGroup.complete}
              Outputs={() => <Outputs workingGroup={workingGroup} />}
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
