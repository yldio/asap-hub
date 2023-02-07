import {
  WorkingGroupResponse,
  WorkingGroupListResponse,
  deliverableStatus,
} from '@asap-hub/model';
import { createCalendarResponse } from './calendars';
import { createUserResponse } from './users';

type FixtureOptions = {
  deliverables?: number;
  members?: number;
  calendars?: number;
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
    user: {
      ...createUserResponse({}, itemIndex),
      id: `user-member-${itemIndex}`,
    },
    workstreamRole: `member role - ${itemIndex}`,
  }));

export const createWorkingGroupLeaders = (
  members: number,
): WorkingGroupResponse['leaders'] =>
  Array.from({ length: members }, (_, itemIndex) => ({
    user: {
      ...createUserResponse({}, itemIndex),
      id: `user-leader-${itemIndex}`,
    },
    role: 'Project Manager' as const,
    workstreamRole: `leader role - ${itemIndex}`,
  }));

export const createWorkingGroupPointOfContact =
  (): WorkingGroupResponse['pointOfContact'] => ({
    role: 'Project Manager',
    workstreamRole: 'PM',
    user: {
      id: '2',
      displayName: 'Peter Venkman',
      firstName: 'Peter',
      lastName: 'Venkman',
      email: 'peter@ven.com',
    },
  });

export const createWorkingGroupResponse = (
  { calendars = 1, deliverables = 1, members = 1 }: FixtureOptions = {},
  itemIndex = 0,
): WorkingGroupResponse => ({
  id: `working-group-id-${itemIndex}`,
  title: `Working Group ${itemIndex}`,
  description: `Working Group ${itemIndex} Description`,
  shortText: `Working Group ${itemIndex} Short Text`,
  lastModifiedDate: '2020-11-09T20:36:54Z',
  externalLink: `https://www.example.com/working-group-${itemIndex}`,
  deliverables: createDeliverables(deliverables),
  complete: false,
  members: createWorkingGroupMembers(members),
  leaders: createWorkingGroupLeaders(members),
  calendars: Array.from({ length: calendars }, (_, index) =>
    createCalendarResponse({ incompleteWorkingGroups: true }, index),
  ),
});

export const createWorkingGroupListResponse = (
  items = 1,
  options: FixtureOptions = {},
): WorkingGroupListResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createWorkingGroupResponse(options, itemIndex),
  ),
});

export default createWorkingGroupListResponse;
