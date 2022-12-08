import { Frame } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWorkingGroupById } from './state';
import WorkingGroupOutputs from './WorkingGroupOutput';

const WorkingGroupProfile: FC = () => {
  const route = network({}).workingGroups({}).workingGroup;
  const { workingGroupId } = useRouteParams(route);
  const workingGroup = useWorkingGroupById(workingGroupId);
  const { path } = useRouteMatch();

  if (workingGroup) {
    return (
      <ResearchOutputPermissionsContext.Provider
        value={{ canCreateUpdate: true }}
      >
        <Frame title={workingGroup.title}>
          <Switch>
            <Route
              path={path + route({ workingGroupId }).createOutput.template}
            >
              <Frame title="Share Working Group Output">
                <WorkingGroupOutputs workingGroupId={workingGroupId} />
              </Frame>
            </Route>
            <WorkingGroupPage {...workingGroup}>
              <WorkingGroupAbout {...workingGroup} />
            </WorkingGroupPage>
          </Switch>
        </Frame>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
