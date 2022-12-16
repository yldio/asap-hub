
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import { FC, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
  const [membersListElementId] = useState(`wg-members-${uuid()}`);

  if (workingGroup) {
    return (
      <Frame title={workingGroup.title}>
        <Switch>
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
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
