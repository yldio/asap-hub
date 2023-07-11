import { gp2 } from '@asap-hub/model';
import { WorkingGroupNetworkDataProvider } from '../data-providers/types';

export default class WorkingGroupNetworkController {
  constructor(
    private workingGroupNetworkDataProvider: WorkingGroupNetworkDataProvider,
  ) {}

  async fetch(): Promise<gp2.ListWorkingGroupNetworkResponse> {
    return this.workingGroupNetworkDataProvider.fetch(null);
  }
}
