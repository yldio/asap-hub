import { WorkingGroupsBody } from '@asap-hub/gp2-components';
import { useWorkingGroupsState } from './state';

const WorkingGroupList: React.FC<Record<string, never>> = () => {
  const workingGroupNetwork = useWorkingGroupsState();
  return <WorkingGroupsBody workingGroupNetwork={workingGroupNetwork} />;
};
export default WorkingGroupList;
