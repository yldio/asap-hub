import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';
import {
  UserPatchRequest,
  UserResponse,
  UserAvatarPostRequest,
  ListUserResponse,
} from '@asap-hub/model';
import { GetListOptions } from '../../../api-util';

export const getUser = jest.fn(
  async (id: string): Promise<UserResponse> => ({
    ...createUserResponse(),
    id,
  }),
);
export const patchUser = jest.fn(
  async (id: string, patch: UserPatchRequest): Promise<UserResponse> => {
    const user = await getUser(id);
    return {
      ...user,
      ...patch,
      teams: user.teams.map((team, i) => ({ ...team, ...patch.teams?.[i] })),
    };
  },
);

export const postUserAvatar = jest.fn(
  async (id: string, post: UserAvatarPostRequest): Promise<UserResponse> => {
    const user = await getUser(id);
    return {
      ...user,
      avatarUrl: `url: ${post.avatar}`,
    };
  },
);

export const getUsers = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<ListUserResponse> =>
    createListUserResponse(pageSize ?? 10),
);
