import { gp2 } from '@asap-hub/model';
import { AccentVariant, Pill } from '@asap-hub/react-components';

type StatusPillProps = {
  status:
    | gp2.ProjectResponse['status']
    | gp2.ProjectResponse['milestones'][0]['status'];
};

export const statusAccent: Record<
  | gp2.ProjectResponse['status']
  | gp2.ProjectResponse['milestones'][0]['status'],
  AccentVariant
> = {
  Active: 'info',
  Completed: 'success',
  Paused: 'warning',
  'Not Started': 'error',
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
  <Pill small={false} accent={statusAccent[status]}>
    {status}
  </Pill>
);
export default StatusPill;
