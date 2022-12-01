import {
  WorkingGroupResponse,
  WorkingGroupListResponse,
  deliverableStatus,
} from '@asap-hub/model';

type FixtureOptions = {
  deliverables?: number;
  members?: number;
};

export const createDeliverables = (
  deliverables: number,
): WorkingGroupResponse['deliverables'] =>
  Array.from({ length: deliverables }, (_, itemIndex) => ({
    description: `Deliverable ${itemIndex}`,
    status: deliverableStatus[itemIndex % deliverableStatus.length],
  }));

export const createWorkingGroupMembers = (
  members: number,
): WorkingGroupResponse['members'] =>
  Array.from({ length: members }, (_, itemIndex) => ({
    displayName: 'Example',
    email: 'test@example.com',
    firstName: 'Mr',
    lastName: 'Example',
    id: `member-${itemIndex}`,
    workingGroupRole: 'Project Manager' as const,
  }));

export const createWorkingGroupResponse = (
  options: FixtureOptions,
  itemIndex = 0,
): WorkingGroupResponse => ({
  id: `working-group-id-${itemIndex}`,
  title: `Working Group ${itemIndex}`,
  description: `Working Group ${itemIndex} Description`,
  complete: false,
  lastModifiedDate: '2020-11-09T20:36:54Z',
  externalLink: `https://www.example.com/working-group-${itemIndex}`,
  externalLinkText: `Working Group ${itemIndex} External Link Text`,
  deliverables: createDeliverables(options?.deliverables ?? 1),
  complete: false,
  members: createWorkingGroupMembers(options?.members ?? 1),
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
