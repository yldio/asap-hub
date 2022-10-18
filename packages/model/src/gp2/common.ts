const resourceType = ['Link', 'Note'] as const;
export type ResourceType = typeof resourceType[number];

export interface Resource {
  type: ResourceType;
  title: string;
  description?: string;
  externalLink?: string;
}
