import { MilestoneStatusDropdown } from '@asap-hub/react-components';

export default {
  title: 'Molecules / MilestoneStatusDropdown',
  component: MilestoneStatusDropdown,
};

export const Pending = () => (
  <MilestoneStatusDropdown
    status="Pending"
    canEdit
    onChange={() => undefined}
  />
);

export const InProgress = () => (
  <MilestoneStatusDropdown
    status="In Progress"
    canEdit
    onChange={() => undefined}
  />
);

export const CompleteReadOnly = () => (
  <MilestoneStatusDropdown status="Complete" canEdit={false} />
);

export const TerminatedReadOnly = () => (
  <MilestoneStatusDropdown status="Terminated" canEdit={false} />
);

export const PendingNotLead = () => (
  <MilestoneStatusDropdown status="Pending" canEdit={false} />
);

export const InProgressUpdating = () => (
  <MilestoneStatusDropdown
    status="In Progress"
    canEdit
    isPending
    onChange={() => undefined}
  />
);

export const PendingUpdating = () => (
  <MilestoneStatusDropdown
    status="Pending"
    canEdit
    isPending
    onChange={() => undefined}
  />
);
