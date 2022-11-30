import { FC } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import { useWorkingGroupById } from './state';

const WorkingGroupProfile: FC = () => {
  const route = network({}).workingGroups({}).workingGroup;
  const { workingGroupId } = useRouteParams(route);
  const { path } = useRouteMatch();
  const workingGroup = useWorkingGroupById(workingGroupId);

  if (workingGroup) {
    return (
      <Frame title={workingGroup.title}>
        <Switch>
          <Route path={path + route({ workingGroupId }).about.template}>
            <WorkingGroupPage {...workingGroup}>
              <Frame title="About">
                <WorkingGroupAbout {...workingGroup} />
              </Frame>
            </WorkingGroupPage>
          </Route>
          <Redirect to={route({ workingGroupId }).about({}).$} />
        </Switch>
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
