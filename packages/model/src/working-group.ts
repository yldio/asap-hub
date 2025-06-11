import { CalendarResponse } from './calendar';
import { FetchOptions, ListResponse } from './common';
import { UserResponse } from './user';

export const deliverableStatus = [
  'Complete',
  'In Progress',
  'Pending',
  'Incomplete',
  'Not Started',
] as const;
export type DeliverableStatus = (typeof deliverableStatus)[number];

export const workingGroupRole = ['Chair', 'Project Manager'] as const;
export type WorkingGroupRole = (typeof workingGroupRole)[number];

export type WorkingGroupLeader = {
  readonly user: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'alumniSinceDate'
    | 'email'
    | 'avatarUrl'
    | 'teams'
  >;
  readonly role: WorkingGroupRole;
  readonly workstreamRole: string;
  readonly inactiveSinceDate?: string;
};
export type WorkingGroupResponseLeader = WorkingGroupLeader & {
  readonly isActive: boolean;
};
//
export type WorkingGroupMember = {
  readonly user: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'alumniSinceDate'
    | 'email'
    | 'avatarUrl'
    | 'teams'
  >;
  readonly inactiveSinceDate?: string;
};
export type WorkingGroupResponseMember = WorkingGroupMember & {
  readonly isActive: boolean;
};

export type WorkingGroupMembership = {
  id: string;
  name: string;
  role: 'Chair' | 'Project Manager' | 'Member';
  active: boolean;
};

export type WorkingGroupDeliverable = {
  description: string;
  status: DeliverableStatus;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  description: string;
  externalLink?: string;
  leaders: WorkingGroupLeader[];
  members: WorkingGroupMember[];
  pointOfContact?: WorkingGroupLeader;
  complete: boolean;
  shortText: string;
  calendars: CalendarResponse[];
  deliverables: WorkingGroupDeliverable[];
  readonly lastModifiedDate: string;
  tags: string[];
  researchOutputsIds?: string[];
};

export type WorkingGroupUpdateDataObject = Pick<
  WorkingGroupDataObject,
  'deliverables'
>;

export type WorkingGroupListDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = Omit<
  WorkingGroupDataObject,
  'leaders' | 'members'
> & {
  leaders: WorkingGroupResponseLeader[];
  members: WorkingGroupResponseMember[];
};

export type WorkingGroupListResponse = ListResponse<WorkingGroupResponse>;

type WorkingGroupFilter = {
  complete?: boolean;
};

export type FetchWorkingGroupOptions = FetchOptions<WorkingGroupFilter>;

export type PublicWorkingGroupListResponse = Pick<
  WorkingGroupResponse,
  'id' | 'title' | 'description'
> & {
  shortDescription: WorkingGroupResponse['shortText'];
  members: (Pick<WorkingGroupResponseLeader, 'role'> & {
    id: WorkingGroupLeader['user']['id'];
    firstName: WorkingGroupLeader['user']['firstName'];
    lastName: WorkingGroupLeader['user']['lastName'];
    displayName: WorkingGroupLeader['user']['displayName'];
    avatarUrl?: WorkingGroupLeader['user']['avatarUrl'];
  })[];
};

export type ListPublicWorkingGroupListResponse =
  ListResponse<PublicWorkingGroupListResponse>;

export type PublicWorkingGroupResponse = Pick<
  WorkingGroupResponse,
  'id' | 'title' | 'description' | 'deliverables' | 'tags'
> & {
  isWorkingGroupComplete: boolean;
  shortDescription: WorkingGroupResponse['shortText'];
  members: {
    id: WorkingGroupMember['user']['id'];
    firstName: WorkingGroupMember['user']['firstName'];
    lastName: WorkingGroupMember['user']['lastName'];
    displayName: WorkingGroupMember['user']['displayName'];
    avatarUrl?: WorkingGroupMember['user']['avatarUrl'];
    role?: WorkingGroupLeader['role'];
  }[];
  researchOutputsIds?: string[];
};
