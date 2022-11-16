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
  title: `Working Group ${itemIndex}`,
  description: `Working Group ${itemIndex} Description`,
  lastModifiedDate: '2020-11-09T20:36:54Z',
  externalLink: `https://www.example.com/working-group-${itemIndex}`,
  externalLinkText: `Working Group ${itemIndex} External Link Text`,
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
