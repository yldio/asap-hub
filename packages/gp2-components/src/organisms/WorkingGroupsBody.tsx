import { ListWorkingGroupsResponse } from '@asap-hub/model/build/gp2';

type WorkingGroupsBodyProps = {
  workingGroups: ListWorkingGroupsResponse;
};
const WorkingGroupsBody: React.FC<WorkingGroupsBodyProps> = () => (
  <div>Test Body</div>
);

export default WorkingGroupsBody;
