import { WorkingGroupsBody, WorkingGroupsPage } from '@asap-hub/gp2-components';
import { useWorkingGroupsState } from './state';

const WorkingGroups: React.FC<Record<string, never>> = () => {
  const workingGroupNetwork = useWorkingGroupsState();
  return (
    <WorkingGroupsPage>
      <WorkingGroupsBody workingGroupNetwork={workingGroupNetwork} />
    </WorkingGroupsPage>
  );
};
export default WorkingGroups;
