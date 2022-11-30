import {
  NotFoundPage,
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { useWorkingGroupById } from './state';

const WorkingGroupProfile: FC = () => {
  const route = network({}).workingGroups({}).workingGroup;
  const { workingGroupId } = useRouteParams(route);
  const workingGroup = useWorkingGroupById(workingGroupId);

  if (workingGroup) {
    return (
      <WorkingGroupPage {...workingGroup}>
        <WorkingGroupAbout {...workingGroup} />
      </WorkingGroupPage>
    );
  }

  return <NotFoundPage />;
};

export default WorkingGroupProfile;
