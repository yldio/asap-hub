import { keywords } from './keywords';

export const resourceTypes = ['Link', 'Note'] as const;
type ResourceTypes = typeof resourceTypes[number];

interface ResourceBase {
  id?: string;
  title: string;
  description?: string;
  type: ResourceTypes;
}
export interface ResourceLink extends ResourceBase {
  type: 'Link';
  externalLink: string;
}
export interface ResourceNote extends ResourceBase {
  type: 'Note';
}
export type Resource = ResourceNote | ResourceLink;

export const isResourceLink = (resource: Resource): resource is ResourceLink =>
  resource.type === 'Link';

export type Keyword = typeof keywords[number];

export interface Calendar {
  id: string;
  name: string;
}

export const milestoneStatus = ['Active', 'Not Started', 'Completed'] as const;
export type MilestoneStatus = typeof milestoneStatus[number];

export type Milestone = {
  description?: string;
  link?: string;
  status: MilestoneStatus;
  title: string;
};

export type Member<T> = {
  id?: string;
  userId: string;
  role: T;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};
