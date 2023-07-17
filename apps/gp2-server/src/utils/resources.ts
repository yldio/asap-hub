import { gp2 } from '@asap-hub/model';

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
