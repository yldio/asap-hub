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
  const workingGroup = useWorkingGroupById(workingGroupId);
  const [membersListElementId] = useState(`wg-members-${uuid()}`);

  if (workingGroup) {
    return (
      <WorkingGroupPage
        membersListElementId={membersListElementId}
        {...workingGroup}
      >
        <WorkingGroupAbout
          membersListElementId={membersListElementId}
          {...workingGroup}
        />
      </WorkingGroupPage>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
