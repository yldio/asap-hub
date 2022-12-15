import { WorkingGroupsBody } from '@asap-hub/gp2-components';
import { useWorkingGroupNetworkState } from './state';

const WorkingGroupList: React.FC<Record<string, never>> = () => {
  const workingGroupNetwork = useWorkingGroupNetworkState();
  return <WorkingGroupsBody workingGroupNetwork={workingGroupNetwork} />;
};
export default WorkingGroupList;
