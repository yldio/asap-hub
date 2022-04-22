import {
  ListGroupResponse,
  GroupResponse,
  ListEventResponse,
} from '@asap-hub/model';
import {
  createListGroupResponse,
  createGroupResponse,
  createListEventResponse,
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

export const getGroupEvents = jest.fn(
  async (): Promise<ListEventResponse> => ({
    ...createListEventResponse(2),
  }),
);
