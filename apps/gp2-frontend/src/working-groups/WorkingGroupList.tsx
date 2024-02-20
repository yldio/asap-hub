import { gp2 } from '@asap-hub/model';
import { WorkingGroupNetwork } from '@asap-hub/gp2-components';
import { useWorkingGroupNetworkState } from './state';

export type WorkingGroupListProps = {
  role: gp2.WorkingGroupNetworkRole;
};

const WorkingGroupList: React.FC<WorkingGroupListProps> = ({ role }) => {
  const workingGroupNetwork = useWorkingGroupNetworkState();
  return (
    <WorkingGroupNetwork
      workingGroupNetwork={workingGroupNetwork}
      role={role}
    />
  );
};
export default WorkingGroupList;
