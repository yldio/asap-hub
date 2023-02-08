import { FC, lazy, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { NotFoundPage, WorkingGroupPage } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';

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

  if (workingGroup) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
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
            route={route({ workingGroupId })}
            ShareOutput={() => (
              <WorkingGroupOutput workingGroupId={workingGroupId} />
            )}
            type="working group"
          />
        </WorkingGroupPage>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
