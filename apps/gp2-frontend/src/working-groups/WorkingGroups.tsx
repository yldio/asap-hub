import { WorkingGroupsPage } from '@asap-hub/gp2-components';

const WorkingGroups: React.FC<Record<string, never>> = () => {
  const workingGroups = { items: [], total: 0 };
  return <WorkingGroupsPage workingGroups={workingGroups} />;
};
export default WorkingGroups;
