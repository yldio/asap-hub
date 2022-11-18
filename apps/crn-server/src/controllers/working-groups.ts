import { WorkingGroupResponse } from '@asap-hub/model';

export interface WorkingGroupController {
  fetchById: (groupId: string) => Promise<WorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  // constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {
  // }

  async fetchById(groupId: string): Promise<WorkingGroupResponse> {
    // const group = await this.workingGroupDataProvider.fetchById(groupId);
    // if (!group) {
    //   throw new NotFoundError(
    //     undefined,
    //     `working group with id ${groupId} not found`,
    //   );
    // }
    // return group;
  }
}
