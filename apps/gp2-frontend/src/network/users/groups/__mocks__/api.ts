import { ListGroupResponse } from '@asap-hub/model';
import { createListGroupResponse } from '@asap-hub/fixtures';

export const getUserGroups = jest.fn(
  async (id: string): Promise<ListGroupResponse> => createListGroupResponse(1),
);
