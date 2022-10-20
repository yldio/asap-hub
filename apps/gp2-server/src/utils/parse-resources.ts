import { gp2 } from '@asap-hub/model';
import { GraphQLProjectResource } from '../data-providers/project.data-provider';
import { GraphQLWorkingGroupResource } from '../data-providers/working-group.data-provider';

export function parseResources(
  resourceList: gp2.Resource[],
  resource: GraphQLWorkingGroupResource,
): gp2.Resource[];
export function parseResources(
  resourceList: gp2.Resource[],
  resource: GraphQLProjectResource,
): gp2.Resource[];
export function parseResources(
  resourceList: gp2.Resource[],
  resource: GraphQLWorkingGroupResource | GraphQLProjectResource,
): gp2.Resource[] {
  if (
    !(resource.title && resource.type) ||
    (resource.type === 'Link' && !resource.externalLink)
  ) {
    return resourceList;
  }

  const parsedResource = {
    title: resource.title,
    description: resource.description || undefined,
  };
  if (resource.type === 'Note') {
    return [
      ...resourceList,
      {
        type: 'Note' as const,
        ...parsedResource,
      },
    ];
  }
  const externalLink = resource.externalLink || '';
  return [
    ...resourceList,
    {
      type: 'Link' as const,
      ...parsedResource,
      externalLink,
    },
  ];
}
