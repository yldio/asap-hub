import { gp2 } from '@asap-hub/model';
import { GraphQLProjectResource } from '../data-providers/project.data-provider';
import { GraphQLWorkingGroupResource } from '../data-providers/working-group.data-provider';

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

export function removeNotAllowedResources(
  workingGroup: gp2.WorkingGroupDataObject,
  loggedInUserId: string,
): gp2.WorkingGroupDataObject;
export function removeNotAllowedResources(
  project: gp2.ProjectDataObject,
  loggedInUserId: string,
): gp2.ProjectDataObject;
export function removeNotAllowedResources(
  { resources, ...entity }: gp2.WorkingGroupDataObject | gp2.ProjectDataObject,
  loggedInUserId: string,
): gp2.WorkingGroupDataObject | gp2.ProjectDataObject {
  const isMember = entity.members.some(
    (member) => member.userId === loggedInUserId,
  );
  return isMember ? { ...entity, resources } : entity;
}
