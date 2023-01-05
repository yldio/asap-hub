import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  NotFoundPage,
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';
import { useCanCreateUpdateResearchOutput, useWorkingGroupById } from './state';
import WorkingGroupOutputs from './WorkingGroupOutput';

const WorkingGroupProfile: FC = () => {
  const route = network({}).workingGroups({}).workingGroup;
  const { workingGroupId } = useRouteParams(route);
  const { path } = useRouteMatch();
  const workingGroup = useWorkingGroupById(workingGroupId);
  const [membersListElementId] = useState(`wg-members-${uuid()}`);

  const canCreateUpdate = useCanCreateUpdateResearchOutput(workingGroup);

  if (workingGroup) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <Frame title={workingGroup.title}>
          <Switch>
            <Route
              path={path + route({ workingGroupId }).createOutput.template}
            >
              <Frame title="Share Working Group Output">
                <WorkingGroupOutputs workingGroupId={workingGroupId} />
              </Frame>
            </Route>
            <Route path={path + route({ workingGroupId }).about.template}>
              <WorkingGroupPage
                membersListElementId={membersListElementId}
                {...workingGroup}
              >
                <Frame title="About">
                  <WorkingGroupAbout
                    membersListElementId={membersListElementId}
                    {...workingGroup}
                  />
                </Frame>
              </WorkingGroupPage>
            </Route>
            <Redirect to={route({ workingGroupId }).about({}).$} />
          </Switch>
        </Frame>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
