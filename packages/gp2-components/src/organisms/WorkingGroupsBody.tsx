import { gp2 } from '@asap-hub/model';
import WorkingGroupNetwork from './WorkingGroupNetwork';

export type WorkingGroupsBodyProps = {
  workingGroupNetwork: gp2.ListWorkingGroupNetworkResponse;
};

const WorkingGroupsBody: React.FC<WorkingGroupsBodyProps> = ({
  workingGroupNetwork,
}) => (
  <>
    <WorkingGroupNetwork
      role={'operational'}
      workingGroupNetwork={workingGroupNetwork}
    />
    <WorkingGroupNetwork
      role={'monogenic'}
      workingGroupNetwork={workingGroupNetwork}
    />
    <WorkingGroupNetwork
      role={'complexDisease'}
      workingGroupNetwork={workingGroupNetwork}
    />
    <WorkingGroupNetwork
      role={'support'}
      workingGroupNetwork={workingGroupNetwork}
    />
  </>
);

export default WorkingGroupsBody;
