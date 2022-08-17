import { Card } from '@asap-hub/react-components';

type WorkingGroupResponse = {
  id: string;
  title: string;
  shortDescription: string;
  leadingMembers?: string;
  members: unknown[];
};

const WorkingGroupDetailPage: React.FC<WorkingGroupResponse> = ({ title }) => (
  <div>
    <Card>Working Group {title}</Card>
  </div>
);

export default WorkingGroupDetailPage;
