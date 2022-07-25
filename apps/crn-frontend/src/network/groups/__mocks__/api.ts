import { ListGroupResponse, GroupResponse } from '@asap-hub/model';
import {
  createListGroupResponse,
  createGroupResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';

export const getGroups = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<ListGroupResponse> =>
    createListGroupResponse(pageSize ?? 10),
);

export const getGroup = jest.fn(
  async (id: string): Promise<GroupResponse> => ({
    ...createGroupResponse(),
    id,
  }),
);
