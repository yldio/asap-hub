import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/working-group.data-provider';

export interface WorkingGroupController {
  fetchById(id: string): Promise<gp2.WorkingGroupResponse>;
  fetch(): Promise<gp2.ListWorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {}

  async fetch(): Promise<gp2.ListWorkingGroupResponse> {
    return this.workingGroupDataProvider.fetch();
  }
  async fetchById(id: string): Promise<gp2.WorkingGroupResponse> {
    const workingGroup = await this.workingGroupDataProvider.fetchById(id);
    if (!workingGroup) {
      throw new NotFoundError(
        undefined,
        `working group with id ${id} not found`,
      );
    }

    return workingGroup;
  }
}
