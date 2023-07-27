import {
  ListInterestGroupResponse,
  InterestGroupResponse,
} from '@asap-hub/model';
import {
  createListInterestGroupResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';

export const getInterestGroups = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<ListInterestGroupResponse> =>
    createListInterestGroupResponse(pageSize ?? 10),
);

export const getInterestGroup = jest.fn(
  async (id: string): Promise<InterestGroupResponse> => ({
    ...createInterestGroupResponse(),
    id,
  }),
);
