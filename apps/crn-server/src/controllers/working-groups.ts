import { NotFoundError } from '@asap-hub/errors';
import { WorkingGroupResponse } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/working-groups.data-provider';

export interface WorkingGroupController {
  fetchById: (groupId: string) => Promise<WorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {}

  async fetchById(groupId: string): Promise<WorkingGroupResponse> {
    const workingGroup = await this.workingGroupDataProvider.fetchById(groupId);
    if (!workingGroup) {
      throw new NotFoundError(
        undefined,
        `working group with id ${groupId} not found`,
      );
    }
    return workingGroup;
  }
}
