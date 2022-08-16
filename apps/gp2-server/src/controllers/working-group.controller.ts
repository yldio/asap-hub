import { gp2 } from '@asap-hub/model';

export interface WorkingGroupController {
  fetch(): Promise<gp2.ListWorkingGroupResponse>;
}

export default class WorkingGroup implements WorkingGroupController {
  async fetch(): Promise<gp2.ListWorkingGroupResponse> {
    return {
      total: 0,
      items: [],
    };
  }
}
