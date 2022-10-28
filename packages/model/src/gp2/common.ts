type ResourceBase = {
  title: string;
  description?: string;
};
export type ResourceLink = ResourceBase & {
  type: 'Link';
  externalLink: string;
};
export type ResourceNote = ResourceBase & {
  type: 'Note';
};
export type Resource = ResourceNote | ResourceLink;
