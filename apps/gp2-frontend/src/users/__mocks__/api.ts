import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';

export const getUsers = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<gp2.ListUserResponse> =>
    gp2Fixtures.createUsersResponse(pageSize ?? 10),
);

export const getUser = jest.fn(
  async (id: string): Promise<gp2.UserResponse> => ({
    ...gp2Fixtures.createUserResponse(),
    id,
  }),
);
