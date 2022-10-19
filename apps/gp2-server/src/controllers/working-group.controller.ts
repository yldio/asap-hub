import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/working-group.data-provider';

export interface WorkingGroupController {
  fetchById(
    id: string,
    loggedInUserId: string,
  ): Promise<gp2.WorkingGroupResponse>;
  fetch(loggedInUserId: string): Promise<gp2.ListWorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {}

  async fetch(loggedInUserId: string): Promise<gp2.ListWorkingGroupResponse> {
    const workingGroups = await this.workingGroupDataProvider.fetch();
    return {
      ...workingGroups,
      items: workingGroups.items.map((workingGroup) =>
        removeNotAllowedResources(workingGroup, loggedInUserId),
      ),
    };
  }
  async fetchById(
    id: string,
    loggedInUserId: string,
  ): Promise<gp2.WorkingGroupResponse> {
    const workingGroup = await this.workingGroupDataProvider.fetchById(id);
    if (!workingGroup) {
      throw new NotFoundError(
        undefined,
        `working group with id ${id} not found`,
      );
    }
    return removeNotAllowedResources(workingGroup, loggedInUserId);
  }
}
const removeNotAllowedResources = (
  workingGroup: gp2.WorkingGroupDataObject,
  loggedInUserId: string,
) => {
  const isMember = workingGroup.members.some(
    (member) => member.userId === loggedInUserId,
  );
  return isMember ? workingGroup : { ...workingGroup, resources: undefined };
};
