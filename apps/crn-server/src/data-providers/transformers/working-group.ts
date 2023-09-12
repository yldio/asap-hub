import { WorkingGroupDeliverable } from '@asap-hub/model';

export const mapDeliverables =
  (complete: boolean) =>
  (deliverable: WorkingGroupDeliverable): WorkingGroupDeliverable => {
    if (complete) {
      if (deliverable.status === 'In Progress') {
        return { ...deliverable, status: 'Incomplete' };
      }
      if (deliverable.status === 'Pending') {
        return { ...deliverable, status: 'Not Started' };
      }
    } else {
      if (deliverable.status === 'Incomplete') {
        return { ...deliverable, status: 'In Progress' };
      }
      if (deliverable.status === 'Not Started') {
        return { ...deliverable, status: 'Pending' };
      }
    }
    return deliverable;
  };
