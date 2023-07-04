import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  WorkingGroupDataObject,
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../data-providers/types';

export default class WorkingGroupController {
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

export const toWorkingGroupResponse = (
  workingGroup: WorkingGroupDataObject,
): WorkingGroupResponse => ({
  ...workingGroup,
  leaders: workingGroup.leaders.map((leader) => ({
    ...leader,
    isActive: workingGroup.complete
      ? false
      : !!leader?.user?.alumniSinceDate === false &&
        !!leader?.inactiveSinceDate === false,
  })),
  members: workingGroup.members.map((member) => ({
    ...member,
    isActive: workingGroup.complete
      ? false
      : !!member?.user?.alumniSinceDate === false &&
        !!member?.inactiveSinceDate === false,
  })),
});
