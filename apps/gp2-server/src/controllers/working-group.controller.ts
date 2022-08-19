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
    const user = await this.workingGroupDataProvider.fetchById(id);
    if (!user) {
      throw new NotFoundError(undefined, `user with id ${id} not found`);
    }

    return user;
  }
}
