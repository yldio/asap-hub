import { WorkingGroupDataObject } from '@asap-hub/model';

export interface WorkingGroupDataProvider {
  fetchById(id: string): Promise<WorkingGroupDataObject | null>;
}
