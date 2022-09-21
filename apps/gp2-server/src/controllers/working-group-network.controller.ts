import { gp2 } from '@asap-hub/model';
import { WorkingGroupNetworkDataProvider } from '../data-providers/working-group-network.data-provider';

export interface WorkingGroupNetworkController {
  fetch(): Promise<gp2.ListWorkingGroupNetworkResponse>;
}

export default class WorkingGroupNetwork
  implements WorkingGroupNetworkController
{
  constructor(
    private workingGroupNetworkDataProvider: WorkingGroupNetworkDataProvider,
  ) {}

  async fetch(): Promise<gp2.ListWorkingGroupNetworkResponse> {
    return this.workingGroupNetworkDataProvider.fetch();
  }
}
