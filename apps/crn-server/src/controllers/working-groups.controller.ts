import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/types';
import { toWorkingGroupResponse } from '../entities/working-group';

export interface WorkingGroupController {
  fetch: (options: FetchOptions) => Promise<WorkingGroupListResponse>;
  fetchById: (groupId: string) => Promise<WorkingGroupResponse>;
}

export default class WorkingGroups implements WorkingGroupController {
  constructor(private workingGroupDataProvider: WorkingGroupDataProvider) {}

  async fetch(options: FetchOptions): Promise<WorkingGroupListResponse> {
    const { filter, ...fetchOptions } = options;

    const workingGroupFilter =
      filter?.length === 1
        ? {
            filter: {
              complete: filter[0] === 'Complete',
            },
          }
        : {};

    const { total, items } = await this.workingGroupDataProvider.fetch({
      ...fetchOptions,
      ...workingGroupFilter,
    });

    return { total, items: items.map(toWorkingGroupResponse) };
  }

  async fetchById(groupId: string): Promise<WorkingGroupResponse> {
    const workingGroup = await this.workingGroupDataProvider.fetchById(groupId);
    if (!workingGroup) {
      throw new NotFoundError(
        undefined,
        `working group with id ${groupId} not found`,
      );
    }

    return toWorkingGroupResponse(workingGroup);
  }
}
