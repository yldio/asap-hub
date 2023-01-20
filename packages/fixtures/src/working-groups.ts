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
  calendarsCount?: number;
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
    user: createUserResponse({}, itemIndex),
    workstreamRole: `member role - ${itemIndex}`,
  }));

export const createWorkingGroupLeaders = (
  members: number,
): WorkingGroupResponse['leaders'] =>
  Array.from({ length: members }, (_, itemIndex) => ({
    user: createUserResponse({}, itemIndex),
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
  { calendarsCount = 1, deliverables, members }: FixtureOptions = {},
  itemIndex = 0,
): WorkingGroupResponse => ({
  id: `working-group-id-${itemIndex}`,
  title: `Working Group ${itemIndex}`,
  description: `Working Group ${itemIndex} Description`,
  shortText: `Working Group ${itemIndex} Short Text`,
  lastModifiedDate: '2020-11-09T20:36:54Z',
  externalLink: `https://www.example.com/working-group-${itemIndex}`,
  deliverables: createDeliverables(deliverables ?? 1),
  complete: false,
  members: createWorkingGroupMembers(members ?? 1),
  leaders: createWorkingGroupLeaders(members ?? 1),
  calendars: Array.from({ length: calendarsCount }, (_, index) =>
    createCalendarResponse(index),
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
