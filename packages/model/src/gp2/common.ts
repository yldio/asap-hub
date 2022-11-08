export const resourceTypes = ['Link', 'Note'] as const;
type ResourceTypes = typeof resourceTypes[number];

interface ResourceBase {
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
