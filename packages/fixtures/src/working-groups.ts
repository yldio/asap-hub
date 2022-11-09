import {
  WorkingGroupResponse,
  WorkingGroupListResponse,
  deliverableStatus,
} from '@asap-hub/model';

type FixtureOptions = {
  deliverables?: number;
};

const createDeliverables = (
  deliverables: number,
): WorkingGroupResponse['deliverables'] =>
  Array.from({ length: deliverables }, (_, itemIndex) => ({
    description: `Deliverable ${itemIndex}`,
    status: deliverableStatus[itemIndex % deliverableStatus.length],
  }));

export const createWorkingGroupResponse = (
  options: FixtureOptions,
  itemIndex = 0,
): WorkingGroupResponse => ({
  id: `working-group-id-${itemIndex}`,
  deliverables: createDeliverables(options?.deliverables ?? 0),
});

export const createWorkingGroupListResponse = (
  items: number,
  options: FixtureOptions = {},
): WorkingGroupListResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createWorkingGroupResponse(options, itemIndex),
  ),
});

export default createWorkingGroupListResponse;
