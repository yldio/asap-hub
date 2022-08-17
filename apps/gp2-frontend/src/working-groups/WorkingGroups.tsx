import { WorkingGroupsPage } from '@asap-hub/gp2-components';
import { useWorkingGroupsState } from './state';

const WorkingGroups: React.FC<Record<string, never>> = () => {
  const workingGroups = useWorkingGroupsState();
  return <WorkingGroupsPage workingGroups={workingGroups} />;
};
export default WorkingGroups;
