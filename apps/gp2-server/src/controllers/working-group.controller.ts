import { gp2 } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/working-group.data-provider';

export interface WorkingGroupController {
  fetch(): Promise<gp2.ListWorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {}

  async fetch(): Promise<gp2.ListWorkingGroupResponse> {
    return this.workingGroupDataProvider.fetch();
  }
}
