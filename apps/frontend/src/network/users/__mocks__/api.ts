import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';
import {
  UserPatchRequest,
  UserResponse,
  UserAvatarPostRequest,
  ListUserResponse,
} from '@asap-hub/model';
import { GetListOptions } from '../../../api-util';
import { InstitutionsResponse } from '../api';

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
      degree: patch.degree === '' ? undefined : patch.degree,
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

export const getUsersLegacy = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<ListUserResponse> =>
    createListUserResponse(pageSize ?? 10),
);
export const getUsers = jest.fn(
  async (): Promise<ListUserResponse> => createListUserResponse(10),
);

export const getInstitutions = jest.fn(
  async (): Promise<InstitutionsResponse> => ({
    number_of_results: 20,
    time_taken: 0,
    items: Array.from({ length: 20 }).map((_, i) => ({
      name: `Institution ${i + 1}`,
      id: `id-${i}`,
      email_address: 'example@example.com',
      status: '',
      wikipedia_url: '',
      established: 1999,
      aliases: [],
      acronyms: [],
      links: [],
      types: [],
    })),
  }),
);
