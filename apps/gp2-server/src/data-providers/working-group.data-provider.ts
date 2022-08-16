import type { gp2 } from '@asap-hub/model';

export interface WorkingGroupDataProvider {
  fetch(): Promise<gp2.ListWorkingGroupDataObject>;
}
export class WorkingGroupSquidexDataProvider
  implements WorkingGroupDataProvider
{
  async fetch(): Promise<gp2.ListWorkingGroupDataObject> {
    return {
      total: 0,
      items: [],
    };
  }
}
